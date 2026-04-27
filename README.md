# Video Downloader Bot

Telegram bot for downloading videos from YouTube, TikTok, Instagram, and Facebook using yt-dlp and fallback APIs.

## Features

· Supports YouTube, TikTok, Instagram, Facebook
· Automatic format detection and quality selection
· Rate limiting per user
· Automatic file cleanup
· Fallback download methods for TikTok

## Requirements

· Node.js 14 or higher
· Telegram Bot Token (from @BotFather)
· yt-dlp installed on the server

## Installation

1. Clone the repository
2. Install dependencies

```
npm install
```

1. Install yt-dlp

```
# Ubuntu/Debian
sudo apt install yt-dlp

# macOS
brew install yt-dlp

# Windows
Download from yt-dlp.github.io
```

1. Copy .env.example to .env and configure your bot token
2. Start the bot

```
npm start
```

## Configuration

Create a .env file with the following variables:

### Variable Description Default
```
BOT_TOKEN - Telegram bot token Required
MAX_FILE_SIZE - Maximum file size in MB 50
MAX_REQUESTS_PER_USER - Maximum downloads per user 15
TIME_WINDOW - Rate limit window in seconds 3600
MAX_QUALITY - Maximum video quality in pixels 720
DOWNLOAD_TIMEOUT - Download timeout in ms 180000
```

### Commands

Command Description
```
/start - Show welcome message
/help - Show available commands
/limit - Check remaining downloads
```

Bot Commands for @BotFather

When creating your bot with @BotFather, set these commands:

```
start - Start the bot
help - Show available commands
limit - Check download limit
```

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Set build command: npm install
3. Set start command: npm start
4. Add environment variables
5. Add a render.yaml or use a Dockerfile

### Deploy to Railway

1. Create a new project on Railway
2. Add a Dockerfile:

```dockerfile
FROM node:18-slim
RUN apt-get update && apt-get install -y yt-dlp
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

### Deploy to VPS

1. Install Node.js and yt-dlp
2. Install PM2: npm install -g pm2
3. Run: pm2 start index.js --name video-bot
4. Save PM2 config: pm2 save
5. Enable startup: pm2 startup

## Project Structure

```
├── index.js          # Main bot entry point
├── config.js         # Configuration and messages
├── handlers/
│   ├── youtube.js    # YouTube downloader
│   ├── tiktok.js     # TikTok downloader with API fallback
│   ├── instagram.js  # Instagram downloader
│   └── facebook.js   # Facebook downloader
├── utils/
│   ├── helpers.js    # Utility functions
│   └── logger.js     # Logging utility
├── database/         # Downloads and cookies storage
└── logs/             # Bot logs
```

### License

MIT
