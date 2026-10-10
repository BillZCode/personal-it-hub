import { Request, Response } from 'express';
import { asyncHandler } from '../middleware';
import { spawn } from 'child_process';

const YTDLP_BIN = '/home/sabbil/.local/bin/yt-dlp';

// Helper to extract media info with yt-dlp
function extractWithYtDlp(url: string): Promise<{ title: string; thumbnail?: string; ext: string }> {
  return new Promise((resolve, reject) => {
    if (!url || !/^https?:\/\//i.test(url.trim())) {
      return reject(new Error('URL must start with http:// or https://'));
    }
    const proc = spawn(YTDLP_BIN, ['-j', '--no-warnings', '--', url.trim()]);
    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; });

    proc.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(stderr || `yt-dlp exited with code ${code}`));
      }
      try {
        const data = JSON.parse(stdout);
        resolve({
          title: data.title || 'Media Video',
          thumbnail: data.thumbnail || data.cover || '',
          ext: data.ext || 'mp4',
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}

interface TikTokExtracted {
  title: string;
  author: string;
  thumbnail: string;
  type: 'video' | 'photo';
  streamUrl: string;
  images?: string[];
}

// Robust TikTok extractor using official mobile feed APIs with multiple fallbacks
async function extractTikTok(rawUrl: string): Promise<TikTokExtracted | null> {
  let targetUrl = rawUrl.trim();

  // 1. Follow redirects for short links (vt.tiktok.com, vm.tiktok.com, tiktok.com/t/)
  if (
    targetUrl.includes('vt.tiktok.com') ||
    targetUrl.includes('vm.tiktok.com') ||
    targetUrl.includes('/t/')
  ) {
    try {
      const resp = await fetch(targetUrl, {
        method: 'GET',
        redirect: 'follow',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      if (resp.url) {
        targetUrl = resp.url;
      }
    } catch (e: any) {
      console.warn('TikTok redirect follow error:', e.message);
    }
  }

  // 2. Extract video/item ID from URL
  const idMatch =
    targetUrl.match(/(?:video|photo|v)\/(\d{15,22})/) || targetUrl.match(/\/(\d{15,22})/);
  const videoId = idMatch ? idMatch[1] : null;

  if (videoId) {
    // 3. Query TikTokv native mobile feed API endpoints (unwatermarked CDN stream)
    const endpoints = [
      'https://api16-normal-c-useast2a.tiktokv.com/aweme/v1/feed/',
      'https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/',
      'https://api22-normal-c-useast1a.tiktokv.com/aweme/v1/feed/',
      'https://api16-normal-useast5.tiktokv.us/aweme/v1/feed/',
    ];

    const params = new URLSearchParams({
      aweme_id: videoId,
      version_name: '1.1.9',
      version_code: '2018111632',
      build_number: '1.1.9',
      device_id: '7234567890123456789',
      iid: '7234567890123456789',
      device_platform: 'android',
    });

    for (const ep of endpoints) {
      try {
        const res = await fetch(ep + '?' + params.toString(), {
          method: 'OPTIONS',
          headers: {
            'User-Agent':
              'com.zhiliaoapp.musically/300904 (2018111632; U; Android 10; en_US; Pixel 4; Build/QQ3A.200805.001; Cronet/58.0.2991.0)',
            Accept: 'application/json',
          },
        });

        if (!res.ok) continue;

        const data: any = await res.json();
        if (data && data.status_code === 0 && data.aweme_list && data.aweme_list.length > 0) {
          const item =
            data.aweme_list.find((x: any) => x.aweme_id === videoId) || data.aweme_list[0];

          // Photo post (Slide)
          if (
            item.image_post_info &&
            item.image_post_info.images &&
            item.image_post_info.images.length > 0
          ) {
            const images: string[] = item.image_post_info.images
              .map((img: any) => img.display_image?.url_list?.[0] || img.display_image?.url_list?.[1])
              .filter(Boolean);

            return {
              title: item.desc || 'TikTok Photo Post',
              author: item.author?.nickname || item.author?.unique_id || 'TikTok User',
              thumbnail: item.video?.cover?.url_list?.[0] || images[0] || '',
              type: 'photo',
              streamUrl: images[0],
              images,
            };
          }

          // Video post
          const streamUrl =
            item.video?.play_addr?.url_list?.[0] || item.video?.download_addr?.url_list?.[0];
          if (streamUrl) {
            return {
              title: item.desc || 'TikTok Video',
              author: item.author?.nickname || item.author?.unique_id || 'TikTok User',
              thumbnail: item.video?.cover?.url_list?.[0] || '',
              type: 'video',
              streamUrl,
            };
          }
        }
      } catch (err: any) {
        console.warn('TikTok endpoint failed:', ep, err.message);
      }
    }
  }

  // 4. TikWM API Fallback
  try {
    const tikwmResp = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(targetUrl)}&hd=1`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Referer: 'https://www.tikwm.com/',
      },
    }).catch(() => null);

    if (tikwmResp && tikwmResp.ok) {
      const data: any = await tikwmResp.json().catch(() => null);
      if (data && data.code === 0 && data.data) {
        const d = data.data;
        if (d.images && Array.isArray(d.images) && d.images.length > 0) {
          return {
            title: d.title || 'TikTok Photos',
            author: d.author?.nickname || 'TikTok User',
            thumbnail: d.cover || d.images[0],
            type: 'photo',
            streamUrl: d.images[0],
            images: d.images,
          };
        }
        const streamUrl = d.hdplay || d.play || d.wmplay;
        if (streamUrl) {
          return {
            title: d.title || 'TikTok Video',
            author: d.author?.nickname || 'TikTok User',
            thumbnail: d.cover || d.origin_cover || '',
            type: 'video',
            streamUrl,
          };
        }
      }
    }
  } catch (err: any) {
    console.warn('TikWM fallback error:', err.message);
  }

  // 5. yt-dlp Fallback
  try {
    const ytInfo = await extractWithYtDlp(targetUrl).catch(() => null);
    if (ytInfo) {
      return {
        title: ytInfo.title,
        author: 'TikTok User',
        thumbnail: ytInfo.thumbnail || '',
        type: 'video',
        streamUrl: targetUrl,
      };
    }
  } catch (err: any) {
    console.warn('yt-dlp fallback error:', err.message);
  }

  return null;
}

export const downloaderController = {
  // Resolve media info and direct download URLs
  resolve: asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url.trim())) {
      return res.status(400).json({ success: false, message: 'Valid HTTP/HTTPS URL is required' });
    }

    const cleanUrl = url.trim();

    // 1. TikTok Handler (Video & Photo Posts)
    if (cleanUrl.includes('tiktok.com')) {
      try {
        const tiktokData = await extractTikTok(cleanUrl);
        if (tiktokData) {
          const safeTitle = (
            tiktokData.title || (tiktokData.type === 'video' ? 'tiktok_video' : 'tiktok_photo')
          )
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .substring(0, 50);

          if (tiktokData.type === 'photo') {
            return res.json({
              success: true,
              platform: 'tiktok',
              type: 'photo',
              title: tiktokData.title || 'TikTok Photo Post',
              author: tiktokData.author,
              thumbnail: tiktokData.thumbnail,
              images: tiktokData.images || [tiktokData.streamUrl],
              downloadUrl: `/api/download/proxy?url=${encodeURIComponent(tiktokData.streamUrl)}&filename=${encodeURIComponent(safeTitle)}.jpg`,
              directUrl: tiktokData.streamUrl,
            });
          }

          // Video: stream from proxy or yt-dlp if direct
          const downloadUrl =
            tiktokData.streamUrl === cleanUrl
              ? `/api/download/stream?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeTitle)}.mp4`
              : `/api/download/proxy?url=${encodeURIComponent(tiktokData.streamUrl)}&filename=${encodeURIComponent(safeTitle)}.mp4`;

          return res.json({
            success: true,
            platform: 'tiktok',
            type: 'video',
            title: tiktokData.title || 'TikTok Video',
            author: tiktokData.author,
            thumbnail: tiktokData.thumbnail,
            downloadUrl,
            directUrl: tiktokData.streamUrl,
          });
        }

        return res.status(400).json({
          success: false,
          message:
            'Tidak dapat mengekstrak media TikTok. Pastikan video atau foto bersifat publik dan tautan valid.',
        });
      } catch (err: any) {
        console.warn('TikTok resolver error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'Gagal mengekstrak media TikTok',
        });
      }
    }

    // 2. YouTube Handler
    if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
      try {
        let videoId = '';
        if (cleanUrl.includes('youtu.be/')) {
          videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0];
        } else if (cleanUrl.includes('v=')) {
          videoId = cleanUrl.split('v=')[1]?.split('&')[0];
        }

        const ytInfo = await extractWithYtDlp(cleanUrl).catch(() => null);
        if (ytInfo) {
          const safeTitle = ytInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
          return res.json({
            success: true,
            platform: 'youtube',
            type: 'video',
            title: ytInfo.title,
            thumbnail: ytInfo.thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ''),
            downloadUrl: `/api/download/stream?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeTitle)}.mp4`,
            directUrl: cleanUrl,
          });
        }

        // Fallback helper
        return res.json({
          success: true,
          platform: 'youtube',
          type: 'video',
          title: `YouTube Video (${videoId || 'Video'})`,
          thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '',
          downloadUrl: `https://www.y2mate.com/youtube/${videoId}`,
          directUrl: cleanUrl,
          externalHelper: true,
        });
      } catch (err) {
        console.warn('YouTube resolver error:', err);
      }
    }

    // 3. Generic File or other supported video platform
    try {
      const ytInfo = await extractWithYtDlp(cleanUrl).catch(() => null);
      if (ytInfo && ytInfo.ext !== 'html') {
        const safeTitle = ytInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
        return res.json({
          success: true,
          platform: 'online_media',
          type: 'video',
          title: ytInfo.title,
          thumbnail: ytInfo.thumbnail,
          downloadUrl: `/api/download/stream?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeTitle)}.${ytInfo.ext}`,
          directUrl: cleanUrl,
        });
      }
    } catch {
      // ignore
    }

    const filename = cleanUrl.split('/').pop()?.split('?')[0] || 'download_file';
    return res.json({
      success: true,
      platform: 'generic',
      type: 'file',
      title: filename,
      downloadUrl: `/api/download/proxy?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(filename)}`,
      directUrl: cleanUrl,
    });
  }),

  // Stream video directly via yt-dlp to output MP4 stream
  stream: asyncHandler(async (req: Request, res: Response) => {
    const rawUrl = req.query.url as string;
    const rawFilename = (req.query.filename as string) || 'video.mp4';

    if (!rawUrl || typeof rawUrl !== 'string' || !/^https?:\/\//i.test(rawUrl.trim())) {
      return res.status(400).send('Valid HTTP/HTTPS URL query parameter is required');
    }

    const targetUrl = rawUrl.trim();
    if (/^(https?:\/\/)(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|0\.0\.0\.0|\[::1\])/i.test(targetUrl)) {
      return res.status(403).send('Akses ke jaringan lokal/privat diblokir demi keamanan (SSRF Protection).');
    }
    let filename = rawFilename.replace(/[\r\n"\\/]/g, '_').replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);

    if (!filename.endsWith('.mp4') && !filename.includes('.')) {
      filename += '.mp4';
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream from yt-dlp stdout directly to client with explicit argument boundary
    const ytdl = spawn(YTDLP_BIN, [
      '-f', 'b/bv+ba/best',
      '-o', '-',
      '--no-warnings',
      '--',
      targetUrl,
    ]);

    ytdl.stdout.pipe(res);

    ytdl.stderr.on('data', (d) => {
      console.warn('yt-dlp stream log:', d.toString());
    });

    req.on('close', () => {
      ytdl.kill();
    });
  }),

  // Stream proxy endpoint to bypass CORS and force attachment download for raw file URLs
  proxy: asyncHandler(async (req: Request, res: Response) => {
    const rawUrl = req.query.url as string;
    const rawFilename = (req.query.filename as string) || 'download';

    if (!rawUrl || typeof rawUrl !== 'string' || !/^https?:\/\//i.test(rawUrl.trim())) {
      return res.status(400).send('Valid HTTP/HTTPS URL query parameter is required');
    }

    const targetUrl = rawUrl.trim();
    if (/^(https?:\/\/)(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|0\.0\.0\.0|\[::1\])/i.test(targetUrl)) {
      return res.status(403).send('Akses ke jaringan lokal/privat diblokir demi keamanan (SSRF Protection).');
    }
    let filename = rawFilename.replace(/[\r\n"\\/]/g, '_').replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);

    const abortController = new AbortController();
    req.on('close', () => {
      abortController.abort();
    });

    try {
      const isTikTok =
        targetUrl.includes('tiktok') ||
        targetUrl.includes('byteoversea') ||
        targetUrl.includes('ibytedtos') ||
        targetUrl.includes('bytedance');

      const response = await fetch(targetUrl, {
        signal: abortController.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Referer: isTikTok ? 'https://www.tiktok.com/' : 'https://www.google.com/',
        },
      });

      if (!response.ok) {
        return res.status(response.status).send(`Gagal mengunduh media sumber: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const contentLength = response.headers.get('content-length');

      const isVideo = contentType.includes('video') || targetUrl.includes('.mp4');
      const isImage = contentType.includes('image') || targetUrl.includes('.jpg') || targetUrl.includes('.jpeg') || targetUrl.includes('.png');

      if (!filename.includes('.')) {
        if (isVideo) filename += '.mp4';
        else if (isImage) filename += '.jpg';
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      if (response.body) {
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
        res.end();
      } else {
        res.status(500).send('No response stream available');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }
      console.error('Downloader proxy error:', err);
      res.status(500).send('Downloader proxy error: ' + err.message);
    }
  }),
};
