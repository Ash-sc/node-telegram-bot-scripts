const fetch = require('node-fetch')
const bot = require('../telegram/bot')

async function sendMessage (msg, config) {
  const { botToken: token, chatId: chat_id, httpProxy } = config || {}
  const botApi = bot.initBot({ token, httpProxy })
  try {
  await botApi.sendMessage({
    chat_id,
    text: msg,
    parse_mode: 'Html',
    disable_web_page_preview: "true",
  })
  } catch(err) {
    console.log(err)
  }
}

async function getNews(config) {
  const { txKey, num = 10 } = config || {}
  const newsData = await fetch(
    `http://api.tianapi.com/world/index?key=${txKey}&num=${num}`
    )
    .then(res => res.text())
    .then(body => JSON.parse(body))

  let msg = ''
  if (newsData?.msg !== 'success') {
    msg = '😞 天行国际新闻查询报错啦'
  } else {
      msg = `<b>🤪🤪🤪, 今日国际新闻</b>


      ${
      newsData?.newslist.map((info, index) => {
        return `<a href="${info.url}">${index + 1}. ${info.title}</a>`
      }).join(`

    `)}`
  }
  await sendMessage(msg, config)
}

exports.getNews = getNews