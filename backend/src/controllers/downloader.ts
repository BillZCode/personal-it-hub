import { Request, Response } from 'express';
import { asyncHandler } from '../middleware';
import { spawn } from 'child_process';

const YTDLP_BIN = '/home/sabbil/.local/bin/yt-dlp';

// Helper to extract media info with yt-dlp
function extractWithYtDlp(url: string): Promise<{ title: string; thumbnail?: string; ext: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_BIN, ['-j', '--no-warnings', url]);
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

export const downloaderController = {
  // Resolve media info and direct download URLs
  resolve: asyncHandler(async (req: Request, res: Response) => {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, message: 'URL is required' });
    }

    const cleanUrl = url.trim();

    // 1. TikTok Handler (Video & Photo Posts)
    if (cleanUrl.includes('tiktok.com')) {
      try {
        // Try yt-dlp metadata extraction
        const ytInfo = await extractWithYtDlp(cleanUrl).catch(() => null);
        if (ytInfo) {
          const safeTitle = ytInfo.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
          return res.json({
            success: true,
            platform: 'tiktok',
            type: 'video',
            title: ytInfo.title,
            thumbnail: ytInfo.thumbnail,
            downloadUrl: `/api/download/stream?url=${encodeURIComponent(cleanUrl)}&filename=${encodeURIComponent(safeTitle)}.mp4`,
            directUrl: cleanUrl,
          });
        }

        // TikWM API fallback
        const tikwmResp = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}&hd=1`).catch(() => null);
        if (tikwmResp && tikwmResp.ok) {
          const data: any = await tikwmResp.json();
          if (data.code === 0 && data.data) {
            const d = data.data;
            const streamUrl = d.hdplay || d.play || d.wmplay;
            if (streamUrl) {
              const safeTitle = (d.title || 'tiktok_video').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 50);
              return res.json({
                success: true,
                platform: 'tiktok',
                type: 'video',
                title: d.title || 'TikTok Video',
                author: d.author?.nickname || 'TikTok User',
                thumbnail: d.cover || d.origin_cover,
                downloadUrl: `/api/download/proxy?url=${encodeURIComponent(streamUrl)}&filename=${encodeURIComponent(safeTitle)}.mp4`,
                directUrl: streamUrl,
              });
            }
          }
        }
      } catch (err) {
        console.warn('TikTok resolver error:', err);
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
    const targetUrl = req.query.url as string;
    let filename = (req.query.filename as string) || 'video.mp4';

    if (!targetUrl) {
      return res.status(400).send('URL query parameter is required');
    }

    if (!filename.endsWith('.mp4') && !filename.includes('.')) {
      filename += '.mp4';
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream from yt-dlp stdout directly to client
    const ytdl = spawn(YTDLP_BIN, [
      '-f', 'b/bv+ba/best',
      '-o', '-',
      '--no-warnings',
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
    const targetUrl = req.query.url as string;
    let filename = (req.query.filename as string) || 'download';

    if (!targetUrl) {
      return res.status(400).send('URL query parameter is required');
    }

    try {
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': targetUrl.includes('tiktok') ? 'https://www.tiktok.com/' : 'https://www.google.com/',
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
      console.error('Downloader proxy error:', err);
      res.status(500).send('Downloader proxy error: ' + err.message);
    }
  }),
};
