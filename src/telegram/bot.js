const TG = require('telegram-bot-api');

exports.initBot = (config = {}) => {
  const { token, httpProxy } = config
  const tgConfig = { token }
  httpProxy && (tgConfig.http_proxy = httpProxy)
  return new TG(tgConfig)
}