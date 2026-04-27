const { exec } = require('child_process');
const util = require('util');
const fs = require('fs-extra');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');

const execPromise = util.promisify(exec);

module.exports.download = async (url, userId) => {
  const filename = helpers.generateFilename('youtube');
  const outputPath = path.join(config.PATHS.DOWNLOADS, filename);
  
  try {
    const command = `yt-dlp -f "best[height<=${config.MAX_QUALITY}]" -o "${outputPath}" --quiet "${url}"`;
    await execPromise(command, { timeout: config.DOWNLOAD_TIMEOUT });
    
    logger.info(`YouTube download successful: ${url}`);
    
    return {
      filePath: outputPath,
      title: 'YouTube Video ✅️'
    };
    
  } catch (error) {
    logger.error(`YouTube download failed: ${error.message}`);
    throw new Error('YouTube download failed');
  }
};
