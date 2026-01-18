# 🎨 Emagine

AI-powered generative desktop environment. Describe what you want, get a working app instantly.

## ✨ Features

- **Natural Language → Apps**: Generate functional web apps from text prompts
- **Minimal Desktop**: Clean interface with draggable/resizable windows
- **Free AI Models**: Powered by Grok 4 Fast via OpenRouter
- **Instant Execution**: Apps run safely in sandboxed iframes

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Add your OpenRouter API key
cp .env.example .env.development
# Edit .env.development and add your key

# Start dev server
bun run dev
```

Visit http://localhost:3000

## 🎮 Usage

Type what you want to build in the prompt bar:

- "Create a calculator"
- "Make a pomodoro timer"
- "Build a tic-tac-toe game"
- "Create a color picker"

Double-click app icons to open them in windows.

## 🛠️ Tech Stack

- **TanStack Start** - Full-stack React framework
- **Nanostores** - Atomic state management
- **Radix UI** - Accessible components
- **Tailwind CSS** - Utility-first styling
- **react-rnd** - Draggable/resizable windows
- **OpenRouter** - Free AI model access

## 📝 License

MIT
