// utils/logger.js
const logger = {
  info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
  success: (msg) => console.log(`[SUCCESS] ${new Date().toISOString()} - ${msg}`),
  error: (msg) => console.log(`[ERROR] ${new Date().toISOString()} - ${msg}`)
};

module.exports = logger;