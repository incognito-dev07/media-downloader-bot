const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');
const logger = require('./utils/logger');
const helpers = require('./utils/helpers');

const bot = new TelegramBot(config.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: { timeout: 10 }
  },
  filepath: false
});

const userStats = new Map();

setInterval(() => {
  helpers.cleanupOldFiles();
}, config.CLEANUP_INTERVAL);

logger.info('Video Downloader Bot started successfully ✅️');

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, config.MESSAGES.WELCOME);
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, config.MESSAGES.HELP);
});

bot.onText(/\/limit/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const stats = userStats.get(userId) || { downloads: 0 };
  const remaining = Math.max(0, config.MAX_REQUESTS_PER_USER - stats.downloads);
  
  await bot.sendMessage(chatId, config.MESSAGES.LIMIT(remaining, config.MAX_REQUESTS_PER_USER));
});

bot.on('message', async (msg) => {
  if (!msg.text || msg.text.startsWith('/')) return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text.trim();

  if (!helpers.isValidUrl(text)) {
    await bot.sendMessage(chatId, config.MESSAGES.INVALID_URL);
    return;
  }

  const platform = helpers.checkPlatform(text);
  if (!platform) {
    await bot.sendMessage(chatId, config.MESSAGES.UNSUPPORTED);
    return;
  }

  const rateLimit = await helpers.checkRateLimit(userId);
  if (!rateLimit.allowed) {
    await bot.sendMessage(chatId, config.MESSAGES.RATE_LIMIT);
    return;
  }

  const stats = userStats.get(userId) || { downloads: 0 };
  stats.downloads = (stats.downloads || 0) + 1;
  userStats.set(userId, stats);

  const processingMsg = await bot.sendMessage(chatId, config.MESSAGES.PROCESSING);

  let downloadedFile;
  try {
    await bot.editMessageText(config.MESSAGES.DOWNLOADING, {
      chat_id: chatId,
      message_id: processingMsg.message_id
    });

    const handler = require(`./handlers/${platform}`);
    downloadedFile = await handler.download(text, userId);

    if (helpers.getFileSizeInMB(downloadedFile.filePath) > config.MAX_FILE_SIZE) {
      throw new Error(config.MESSAGES.FILE_TOO_LARGE);
    }

    await bot.editMessageText(config.MESSAGES.UPLOADING, {
      chat_id: chatId,
      message_id: processingMsg.message_id
    });

    const videoStream = fs.createReadStream(downloadedFile.filePath);
    await bot.sendVideo(chatId, videoStream, {
      caption: downloadedFile.title,
      supports_streaming: true
    });

    await bot.deleteMessage(chatId, processingMsg.message_id);

  } catch (error) {
    logger.error(`Download failed: ${error.message}`);
    
    if (userStats.has(userId)) {
      const currentStats = userStats.get(userId);
      if (currentStats.downloads > 0) {
        currentStats.downloads--;
        userStats.set(userId, currentStats);
      }
    }

    await bot.editMessageText(
      config.MESSAGES.ERROR.replace('{error}', error.message),
      {
        chat_id: chatId,
        message_id: processingMsg.message_id
      }
    );
  } finally {
    if (downloadedFile && downloadedFile.filePath) {
      await helpers.safeDelete(downloadedFile.filePath);
    }
  }
});

bot.on('polling_error', (error) => {
  logger.error(`Polling error: ${error.message}`);
});

process.on('SIGINT', () => {
  bot.stopPolling();
  process.exit(0);
});
