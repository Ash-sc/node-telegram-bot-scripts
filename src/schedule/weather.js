const fetch = require('node-fetch')
const bot = require('../telegram/bot')
const weatherStatic = require('../static/weather')

async function sendMessage (msg, config) {
  const { botToken: token, chatId: chat_id, httpProxy } = config || {}
  const botApi = bot.initBot({ token, httpProxy })
  await botApi.sendMessage({
    chat_id,
    text: msg,
    parse_mode: 'Markdown'
    
  }).then(console.log)
  .catch(console.err)
}

async function weatherSchedule(config) {
  const { gdKey, city } = config || {}
  const weatherData = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${gdKey}&city=${city}&extensions=all`
    )
    .then(res => res.text())
    .then(body => JSON.parse(body))

  let msg = ''
  if (weatherData.info !== 'OK') {
    msg = '😞 天气查询报错啦'
  } else {
    const todayDetail = weatherData?.forecasts?.[0]?.casts?.[config.dayOffset || 0] || {}
    const city = weatherData?.forecasts?.[0].city || ''
    if (!Object.keys(todayDetail).length) {
      msg = '😞 天气查询失败'
    } else {
      msg = `😙😙😙, ${todayDetail.date}${city}:

${todayDetail.dayweather}${weatherStatic.weatherLogoMap[todayDetail.dayweather] || ''}${todayDetail.dayweather === todayDetail.nightweather ? '' : `,预计夜间转${todayDetail.nightweather}${weatherStatic.weatherLogoMap[todayDetail.nightweather] || ''}`}  ${todayDetail.daytemp}℃ - ${todayDetail.nighttemp}℃ ${todayDetail.daywind}风${todayDetail.daypower}级

${weatherStatic.dressRecommendations(+todayDetail.daytemp, +todayDetail.nighttemp)}
      `
    }
  }
  await sendMessage(msg, config)
}

exports.weatherSchedule = weatherSchedule