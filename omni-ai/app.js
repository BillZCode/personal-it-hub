// Configuration & State
const DEFAULT_API_KEY = "";

const validModels = [
  'gemini-3-flash-preview',
  'gemini-robotics-er-2-preview',
  'gemma-4-26b-a4b-it'
];

const modelDisplayNames = {
  'gemini-3-flash-preview': 'Flash 3 Preview',
  'gemini-robotics-er-2-preview': 'Embodied Agentic ER-2',
  'gemma-4-26b-a4b-it': 'Gemma 4 26B'
};

const rawSavedModel = localStorage.getItem('omni_ai_model');
const initialModel = validModels.includes(rawSavedModel) ? rawSavedModel : 'gemini-3-flash-preview';

const state = {
  apiKey: localStorage.getItem('omni_ai_api_key') || localStorage.getItem('gemini_api_key') || DEFAULT_API_KEY,
  provider: localStorage.getItem('omni_ai_provider') || 'google',
  customEndpoint: localStorage.getItem('omni_ai_endpoint') || 'http://localhost:20128/v1',
  model: initialModel,
  systemInstruction: localStorage.getItem('omni_ai_sys_instruction') || localStorage.getItem('gemini_sys_instruction') || 'Anda adalah Omni AI, asisten rekayasa teknologi dan coding yang cerdas, ringkas, solutif, dan profesional.',
  temperature: parseFloat(localStorage.getItem('omni_ai_temp') || localStorage.getItem('gemini_temp') || '0.7'),
  conversations: JSON.parse(localStorage.getItem('omni_ai_conversations') || localStorage.getItem('gemini_conversations') || '[]'),
  currentChatId: null,
  isGenerating: false
};

// DOM Elements
const sidebar = document.getElementById('sidebar');
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const btnNewChat = document.getElementById('btnNewChat');
const historyList = document.getElementById('historyList');
const modelSelect = document.getElementById('modelSelect');
const activeModelBadge = document.getElementById('activeModelBadge');
const currentChatTitle = document.getElementById('currentChatTitle');
const messagesViewport = document.getElementById('messagesViewport');
const welcomeScreen = document.getElementById('welcomeScreen');
const messagesList = document.getElementById('messagesList');
const chatInput = document.getElementById('chatInput');
const btnSend = document.getElementById('btnSend');
const btnClearChat = document.getElementById('btnClearChat');
const btnSettings = document.getElementById('btnSettings');
const settingsModal = document.getElementById('settingsModal');
const btnCloseSettings = document.getElementById('btnCloseSettings');
const settingsForm = document.getElementById('settingsForm');
const providerSelect = document.getElementById('providerSelect');
const customEndpointGroup = document.getElementById('customEndpointGroup');
const customEndpointInput = document.getElementById('customEndpointInput');
const apiKeyInput = document.getElementById('apiKeyInput');
const btnToggleKeyVisibility = document.getElementById('btnToggleKeyVisibility');
const keyVisibilityIcon = document.getElementById('keyVisibilityIcon');
const btnResetDefaultKey = document.getElementById('btnResetDefaultKey');
const btnCancelSettings = document.getElementById('btnCancelSettings');
const systemInstructionInput = document.getElementById('systemInstructionInput');
const temperatureInput = document.getElementById('temperatureInput');
const tempValue = document.getElementById('tempValue');
const promptSuggestions = document.querySelectorAll('.suggestion-card');

// Image upload DOM Elements
const imageFileInput = document.getElementById('imageFileInput');
const btnUploadImage = document.getElementById('btnUploadImage');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreviewImg = document.getElementById('imagePreviewImg');
const btnRemoveImage = document.getElementById('btnRemoveImage');
const imagePreviewName = document.getElementById('imagePreviewName');

let currentImageAttachment = null;

// Setup Marked for Markdown rendering
if (window.marked) {
  marked.setOptions({
    highlight: function(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang }).value;
        } catch (e) {}
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true
  });
}

function getModelLabel(modelId) {
  return modelDisplayNames[modelId] || modelId;
}

// Initialise App
function initApp() {
  if (!validModels.includes(localStorage.getItem('omni_ai_model'))) {
    localStorage.setItem('omni_ai_model', 'gemini-3-flash-preview');
    state.model = 'gemini-3-flash-preview';
  }

  modelSelect.value = state.model;
  activeModelBadge.textContent = getModelLabel(state.model);
  apiKeyInput.value = state.apiKey;
  systemInstructionInput.value = state.systemInstruction;
  temperatureInput.value = state.temperature;
  tempValue.textContent = state.temperature;

  renderHistory();

  // Load last active conversation or create new
  if (state.conversations.length > 0) {
    loadChat(state.conversations[0].id);
  } else {
    createNewChat();
  }

  setupEventListeners();
}

function setupEventListeners() {
  // Sidebar toggle
  btnToggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Model change
  modelSelect.addEventListener('change', (e) => {
    state.model = e.target.value;
    activeModelBadge.textContent = getModelLabel(state.model);
    localStorage.setItem('omni_ai_model', state.model);
  });

  // New Chat
  btnNewChat.addEventListener('click', () => {
    createNewChat();
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  });

  // Clear current chat
  btnClearChat.addEventListener('click', () => {
    const current = getCurrentChat();
    if (current && current.messages.length > 0) {
      if (confirm('Kosongkan pesan dalam sesi ini?')) {
        current.messages = [];
        saveConversations();
        renderMessages();
      }
    }
  });

  // Textarea auto-resize & keyboard send
  chatInput.addEventListener('input', autoResizeTextarea);
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Send button
  btnSend.addEventListener('click', handleSendMessage);

  // Settings modal
  btnSettings.addEventListener('click', () => {
    providerSelect.value = state.provider;
    customEndpointInput.value = state.customEndpoint;
    customEndpointGroup.style.display = (state.provider === 'custom' || state.provider === '9router') ? 'block' : 'none';
    apiKeyInput.value = state.apiKey;
    apiKeyInput.type = 'password';
    keyVisibilityIcon.textContent = '👁️ Lihat';
    systemInstructionInput.value = state.systemInstruction;
    temperatureInput.value = state.temperature;
    tempValue.textContent = state.temperature;
    settingsModal.classList.add('active');
  });

  providerSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === '9router') {
      customEndpointGroup.style.display = 'block';
      customEndpointInput.value = 'http://localhost:20128/v1';
    } else if (val === 'openrouter') {
      customEndpointGroup.style.display = 'none';
      apiKeyInput.placeholder = 'Masukkan OpenRouter API Key (sk-or-v1-...)';
    } else if (val === 'custom') {
      customEndpointGroup.style.display = 'block';
      if (!customEndpointInput.value || customEndpointInput.value === 'http://localhost:20128/v1') {
        customEndpointInput.value = 'http://localhost:8000/v1';
      }
    } else {
      customEndpointGroup.style.display = 'none';
      apiKeyInput.placeholder = 'Masukkan API Key Google AI...';
    }
  });

  btnToggleKeyVisibility.addEventListener('click', () => {
    if (apiKeyInput.type === 'password') {
      apiKeyInput.type = 'text';
      keyVisibilityIcon.textContent = '🔒 Sembunyikan';
    } else {
      apiKeyInput.type = 'password';
      keyVisibilityIcon.textContent = '👁️ Lihat';
    }
  });

  btnResetDefaultKey.addEventListener('click', () => {
    apiKeyInput.value = DEFAULT_API_KEY;
    apiKeyInput.type = 'text';
    keyVisibilityIcon.textContent = '🔒 Sembunyikan';
  });

  btnCancelSettings.addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  btnCloseSettings.addEventListener('click', () => {
    settingsModal.classList.remove('active');
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.remove('active');
    }
  });

  temperatureInput.addEventListener('input', (e) => {
    tempValue.textContent = e.target.value;
  });

  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    state.provider = providerSelect.value;
    state.customEndpoint = customEndpointInput.value.trim() || 'http://localhost:20128/v1';
    state.apiKey = apiKeyInput.value.trim() || DEFAULT_API_KEY;
    state.systemInstruction = systemInstructionInput.value.trim();
    state.temperature = parseFloat(temperatureInput.value);

    localStorage.setItem('omni_ai_provider', state.provider);
    localStorage.setItem('omni_ai_endpoint', state.customEndpoint);
    localStorage.setItem('omni_ai_api_key', state.apiKey);
    localStorage.setItem('omni_ai_sys_instruction', state.systemInstruction);
    localStorage.setItem('omni_ai_temp', state.temperature.toString());

    settingsModal.classList.remove('active');
  });

  // Prompt suggestions
  promptSuggestions.forEach(card => {
    card.addEventListener('click', () => {
      const promptText = card.getAttribute('data-prompt');
      if (promptText) {
        chatInput.value = promptText;
        autoResizeTextarea();
        handleSendMessage();
      }
    });
  });

  // Image Upload Handling
  if (imageFileInput) {
    imageFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        processSelectedImage(file);
      }
    });
  }

  if (btnUploadImage) {
    btnUploadImage.addEventListener('click', (e) => {
      // Direct programmatic click to guarantee file chooser opens in all contexts/iframes
      if (imageFileInput) {
        imageFileInput.value = ''; // allow re-selecting same file
        imageFileInput.click();
      }
    });

    btnUploadImage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (imageFileInput) {
          imageFileInput.value = '';
          imageFileInput.click();
        }
      }
    });
  }

  if (btnRemoveImage) {
    btnRemoveImage.addEventListener('click', clearSelectedImage);
  }

  // Paste image directly from clipboard
  chatInput.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (items) {
      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            processSelectedImage(file);
            break;
          }
        }
      }
    }
  });
}

function processSelectedImage(file) {
  if (!file.type.startsWith('image/')) {
    alert('Silakan pilih file gambar yang valid (PNG, JPG, WebP, GIF).');
    return;
  }

  // Max 10MB check
  if (file.size > 10 * 1024 * 1024) {
    alert('Ukuran gambar maksimal adalah 10MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(evt) {
    const dataUrl = evt.target.result;
    const base64Data = dataUrl.split(',')[1];
    currentImageAttachment = {
      name: file.name || 'Pasted-Image.png',
      mimeType: file.type || 'image/png',
      base64Data: base64Data,
      dataUrl: dataUrl
    };

    imagePreviewImg.src = dataUrl;
    imagePreviewName.textContent = currentImageAttachment.name;
    imagePreviewContainer.style.display = 'flex';
    chatInput.placeholder = "Tanyakan sesuatu tentang gambar ini... (tekan Enter untuk kirim)";
    chatInput.focus();
  };
  reader.readAsDataURL(file);
}

function clearSelectedImage() {
  currentImageAttachment = null;
  if (imageFileInput) imageFileInput.value = '';
  if (imagePreviewImg) imagePreviewImg.src = '';
  if (imagePreviewName) imagePreviewName.textContent = '';
  if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
  chatInput.placeholder = "Tulis pesan atau tanyakan gambar yang diunggah... (Shift + Enter untuk baris baru)";
}

function autoResizeTextarea() {
  chatInput.style.height = 'auto';
  chatInput.style.height = `${Math.min(chatInput.scrollHeight, 160)}px`;
}

// Conversation Management
function createNewChat() {
  const newChat = {
    id: 'chat_' + Date.now(),
    title: 'Percakapan Baru',
    timestamp: Date.now(),
    messages: []
  };

  state.conversations.unshift(newChat);
  state.currentChatId = newChat.id;
  saveConversations();
  renderHistory();
  renderMessages();
  currentChatTitle.textContent = newChat.title;
  chatInput.focus();
}

function loadChat(chatId) {
  state.currentChatId = chatId;
  const current = getCurrentChat();
  if (current) {
    currentChatTitle.textContent = current.title;
    renderMessages();
    renderHistory();
  }
}

function getCurrentChat() {
  return state.conversations.find(c => c.id === state.currentChatId);
}

function saveConversations() {
  localStorage.setItem('omni_ai_conversations', JSON.stringify(state.conversations));
}

function deleteChat(chatId, e) {
  e.stopPropagation();
  state.conversations = state.conversations.filter(c => c.id !== chatId);
  saveConversations();

  if (state.currentChatId === chatId) {
    if (state.conversations.length > 0) {
      loadChat(state.conversations[0].id);
    } else {
      createNewChat();
    }
  } else {
    renderHistory();
  }
}

function renderHistory() {
  historyList.innerHTML = '';
  state.conversations.forEach(chat => {
    const item = document.createElement('div');
    item.className = `history-item ${chat.id === state.currentChatId ? 'active' : ''}`;
    item.onclick = () => loadChat(chat.id);

    item.innerHTML = `
      <div class="history-title" title="${escapeHtml(chat.title)}">
        ${escapeHtml(chat.title)}
      </div>
      <button class="history-delete" title="Hapus Chat" onclick="deleteChat('${chat.id}', event)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    `;
    historyList.appendChild(item);
  });
}

function renderMessages() {
  const current = getCurrentChat();
  if (!current || current.messages.length === 0) {
    welcomeScreen.style.display = 'flex';
    messagesList.innerHTML = '';
    return;
  }

  welcomeScreen.style.display = 'none';
  messagesList.innerHTML = '';

  current.messages.forEach(msg => {
    appendMessageElement(msg.role, msg.content, false, msg.modelUsed, msg.image);
  });

  scrollToBottom();
}

function appendMessageElement(role, text, isStreaming = false, modelUsed = null, imageAttachment = null) {
  const row = document.createElement('div');
  row.className = `message-row ${role}`;

  const isUser = role === 'user';
  const avatarHtml = isUser 
    ? `<div class="avatar user-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div>`
    : `<div class="avatar ai-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>`;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const modelName = modelUsed ? getModelLabel(modelUsed) : getModelLabel(state.model);

  let imageHtml = '';
  if (imageAttachment && imageAttachment.dataUrl) {
    imageHtml = `
      <div class="chat-attachment-wrapper">
        <a href="${imageAttachment.dataUrl}" target="_blank" rel="noopener noreferrer" title="Klik untuk memperbesar gambar">
          <img src="${imageAttachment.dataUrl}" alt="${escapeHtml(imageAttachment.name || 'Gambar')}" class="chat-attachment-img" />
        </a>
      </div>
    `;
  }

  row.innerHTML = `
    ${avatarHtml}
    <div class="bubble-content">
      <div class="message-meta">${isUser ? 'Anda' : modelName} • ${timeStr}</div>
      <div class="bubble">
        ${imageHtml}
        ${text ? `<div>${formatMarkdown(text)}</div>` : ''}
      </div>
    </div>
  `;

  messagesList.appendChild(row);
  attachCopyButtons(row);
  scrollToBottom();

  return row;
}

function formatMarkdown(content) {
  if (!content) return '';
  if (window.marked) {
    try {
      return marked.parse(content);
    } catch (e) {
      return escapeHtml(content);
    }
  }
  return escapeHtml(content).replace(/\n/g, '<br>');
}

function attachCopyButtons(container) {
  const codeBlocks = container.querySelectorAll('pre code');
  codeBlocks.forEach(code => {
    const pre = code.parentElement;
    if (pre.querySelector('.code-header')) return;

    let lang = 'code';
    for (const className of code.classList) {
      if (className.startsWith('language-')) {
        lang = className.replace('language-', '');
        break;
      }
    }

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = `
      <span>${lang}</span>
      <button class="copy-btn" title="Salin Kode">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Salin
      </button>
    `;

    const copyBtn = header.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(code.innerText).then(() => {
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Tersalin!
        `;
        setTimeout(() => {
          copyBtn.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Salin
          `;
        }, 2000);
      });
    });

    pre.insertBefore(header, code);
  });
}

function scrollToBottom() {
  messagesViewport.scrollTop = messagesViewport.scrollHeight;
}

// Sending Messages & Calling Multi-Model API
async function handleSendMessage() {
  if (state.isGenerating) return;

  const text = chatInput.value.trim();
  const imageToSend = currentImageAttachment;

  // Need at least text or image
  if (!text && !imageToSend) return;

  const current = getCurrentChat();
  if (!current) return;

  // Prepare message object
  const userMessage = {
    role: 'user',
    content: text || '(Gambar dilampirkan)'
  };

  if (imageToSend) {
    userMessage.image = { ...imageToSend };
  }

  // Add User Message
  current.messages.push(userMessage);
  welcomeScreen.style.display = 'none';
  appendMessageElement('user', text, false, null, imageToSend);

  // If first message, update chat title
  if (current.messages.length === 1) {
    const titleText = text || (imageToSend ? `Analisis: ${imageToSend.name}` : 'Percakapan Gambar');
    current.title = titleText.length > 25 ? titleText.slice(0, 25) + '...' : titleText;
    currentChatTitle.textContent = current.title;
    renderHistory();
  }

  saveConversations();

  // Reset input & clear attached image
  chatInput.value = '';
  chatInput.style.height = 'auto';
  clearSelectedImage();
  btnSend.disabled = true;
  state.isGenerating = true;

  // Render temporary AI thinking placeholder
  const aiRow = document.createElement('div');
  aiRow.className = 'message-row ai';
  aiRow.innerHTML = `
    <div class="avatar ai-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg></div>
    <div class="bubble-content">
      <div class="message-meta">${getModelLabel(state.model)} • Memproses respons...</div>
      <div class="bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    </div>
  `;
  messagesList.appendChild(aiRow);
  scrollToBottom();

  const bubbleDiv = aiRow.querySelector('.bubble');

  try {
    const contents = current.messages.map(msg => {
      const parts = [];
      // If message has image attachment (multimodal vision)
      if (msg.image && msg.image.base64Data && msg.image.mimeType) {
        parts.push({
          inlineData: {
            mimeType: msg.image.mimeType,
            data: msg.image.base64Data
          }
        });
      }
      if (msg.content) {
        parts.push({ text: msg.content });
      }
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: parts.length > 0 ? parts : [{ text: ' ' }]
      };
    });

    const payload = {
      contents: contents,
      generationConfig: {
        temperature: state.temperature,
        topP: 0.95,
        topK: 40
      }
    };

    if (state.systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: state.systemInstruction }]
      };
    }

    let response;
    let usedModel = state.model;
    const fallbackList = [usedModel, 'gemini-3-flash-preview', 'gemini-robotics-er-2-preview', 'gemma-4-26b-a4b-it'].filter((v, i, a) => a.indexOf(v) === i);

    for (let i = 0; i < fallbackList.length; i++) {
      usedModel = fallbackList[i];
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${usedModel}:streamGenerateContent?alt=sse&key=${state.apiKey}`;
      
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        if (usedModel !== state.model) {
          state.model = usedModel;
          modelSelect.value = usedModel;
          activeModelBadge.textContent = getModelLabel(usedModel);
          localStorage.setItem('omni_ai_model', usedModel);
        }
        break;
      }

      if (response.status === 503 && i < fallbackList.length - 1) {
        console.warn(`Model ${usedModel} sibuk (503), beralih ke cadangan ${fallbackList[i+1]}...`);
        continue;
      }

      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP error! status: ${response.status}`);
    }

    // Handle SSE streaming
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let aiResponseText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop();

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace('data: ', '').trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const data = JSON.parse(jsonStr);
            const candidate = data.candidates?.[0];
            const parts = candidate?.content?.parts || [];
            for (const part of parts) {
              if (part.text && !part.thought) {
                aiResponseText += part.text;
                bubbleDiv.innerHTML = formatMarkdown(aiResponseText);
                attachCopyButtons(aiRow);
                scrollToBottom();
              }
            }
          } catch (e) {
            console.error('Error parsing SSE chunk:', e);
          }
        }
      }
    }

    if (!aiResponseText.trim()) {
      aiResponseText = "(Tidak ada respons teks yang dihasilkan)";
      bubbleDiv.innerHTML = `<span style="color: var(--text-dim); font-style: italic;">${aiResponseText}</span>`;
    }

    current.messages.push({ role: 'model', content: aiResponseText, modelUsed: usedModel });
    saveConversations();
    aiRow.querySelector('.message-meta').textContent = `${getModelLabel(usedModel)} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  } catch (error) {
    console.error('Error generating AI response:', error);
    bubbleDiv.innerHTML = `
      <div style="color: #ef4444; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <strong>Gagal memproses jawaban AI</strong>
        </div>
        <div style="font-size: 0.82rem; color: #fca5a5;">${escapeHtml(error.message)}</div>
      </div>
    `;
  } finally {
    state.isGenerating = false;
    btnSend.disabled = false;
    chatInput.focus();
  }
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function triggerImageUpload() {
  const input = document.getElementById('imageFileInput');
  if (input) {
    input.value = '';
    input.click();
  }
}

window.deleteChat = deleteChat;
window.triggerImageUpload = triggerImageUpload;
window.processSelectedImage = processSelectedImage;
window.clearSelectedImage = clearSelectedImage;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
