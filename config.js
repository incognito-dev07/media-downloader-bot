require('dotenv').config();
const path = require('path');

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 50,
  MAX_REQUESTS_PER_USER: parseInt(process.env.MAX_REQUESTS_PER_USER) || 15,
  TIME_WINDOW: parseInt(process.env.TIME_WINDOW) || 3600,
  MAX_QUALITY: parseInt(process.env.MAX_QUALITY) || 720,
  DOWNLOAD_TIMEOUT: parseInt(process.env.DOWNLOAD_TIMEOUT) || 180000,
  CLEANUP_INTERVAL: parseInt(process.env.CLEANUP_INTERVAL) || 3600000,
  
  PATHS: {
    DOWNLOADS: path.join(__dirname, 'database', 'downloads'),
    LOGS: path.join(__dirname, 'logs'),
    COOKIES: path.join(__dirname, 'database', 'cookies.json')
  },
  
  MESSAGES: {
    WELCOME: `🎬 𝐕𝐢𝐝𝐞𝐨 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐫\n\nSupported Platforms:\n• Facebook (facebook.com)\n• TikTok (tiktok.com)\n• YouTube (youtube.com)\n• Instagram (instagram.com)\n\nFeatures:\n• Multiple fallback methods\n• High-quality video download\n• Automatic format detection`,
    HELP: `📖 𝐂𝐨𝐦𝐦𝐚𝐧𝐝𝐬:\n/start - Start the bot\n/help - Show available commands\n/limit - Check download limit`,
    LIMIT: (remaining, total) => `📊 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐋𝐢𝐦𝐢𝐭\n\nRemaining: ${remaining}/${total}`,
    PROCESSING: `⏳ Processing...`,
    DOWNLOADING: `📥 Downloading video...`,
    UPLOADING: `📤 Uploading, please wait...`,
    SUCCESS: `✅ Download complete`,
    ERROR: `❌ Error: {error}`,
    RATE_LIMIT: `⚠️ Limit reached. Try again later.`,
    FILE_TOO_LARGE: `❌ File exceeds ${process.env.MAX_FILE_SIZE || 50}MB limit`,
    INVALID_URL: `❌ Invalid URL`,
    UNSUPPORTED: `❌ Platform not supported`
  }
};
