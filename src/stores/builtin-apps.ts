import { App } from './desktop'

export const SETTINGS_APP: App = {
  id: '__builtin_settings',
  name: 'Settings',
  icon: '⚙️',
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Settings</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #1e293b;
      color: #e2e8f0;
      padding: 24px;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 24px;
      color: #f1f5f9;
    }
    .section {
      background: #334155;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .section h2 {
      font-size: 16px;
      margin-bottom: 12px;
      color: #cbd5e1;
    }
    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #475569;
    }
    .setting-item:last-child {
      border-bottom: none;
    }
    .setting-label {
      font-size: 14px;
    }
    .todo-badge {
      background: #f59e0b;
      color: #000;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    input[type="text"] {
      background: #1e293b;
      border: 1px solid #475569;
      color: #e2e8f0;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 14px;
      width: 300px;
    }
    button {
      background: #7c3aed;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #6d28d9;
    }
  </style>
</head>
<body>
  <h1>⚙️ Settings</h1>

  <div class="section">
    <h2>API Configuration</h2>
    <div class="setting-item">
      <div class="setting-label">Bring Your Own Key (BYOK)</div>
      <span class="todo-badge">TODO</span>
    </div>
    <div class="setting-item">
      <div class="setting-label">
        <div>OpenRouter API Key</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
          Configure your own API key (Coming soon)
        </div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2>Appearance</h2>
    <div class="setting-item">
      <div class="setting-label">Theme</div>
      <span style="color: #94a3b8;">Dark (default)</span>
    </div>
    <div class="setting-item">
      <div class="setting-label">Wallpaper</div>
      <span style="color: #94a3b8;">Nature (random)</span>
    </div>
  </div>

  <div class="section">
    <h2>About</h2>
    <div class="setting-item">
      <div class="setting-label">Version</div>
      <span style="color: #94a3b8;">v1.0</span>
    </div>
    <div class="setting-item">
      <div class="setting-label">Powered by</div>
      <span style="color: #94a3b8;">Grok 4 Fast (OpenRouter)</span>
    </div>
  </div>
</body>
</html>`,
  createdAt: Date.now()
}

export const TRASH_APP: App = {
  id: '__builtin_trash',
  name: 'Trash',
  icon: '🗑️',
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trash</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #1e293b;
      color: #e2e8f0;
      padding: 24px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 24px;
      color: #f1f5f9;
    }
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #64748b;
      text-align: center;
    }
    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    .empty-message {
      font-size: 18px;
      margin-bottom: 8px;
    }
    .empty-hint {
      font-size: 14px;
      color: #475569;
    }
    .trash-item {
      background: #334155;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .item-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .item-icon {
      font-size: 32px;
    }
    .item-name {
      font-size: 16px;
    }
    button {
      background: #dc2626;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background: #b91c1c;
    }
  </style>
</head>
<body>
  <h1>🗑️ Trash</h1>

  <div class="empty-state">
    <div class="empty-icon">🗑️</div>
    <div class="empty-message">Trash is empty</div>
    <div class="empty-hint">Drag apps here to delete them</div>
  </div>

  <!-- TODO: Add trash items dynamically -->
</body>
</html>`,
  createdAt: Date.now()
}

export const BUILTIN_APPS = [SETTINGS_APP, TRASH_APP]
