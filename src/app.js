const schedule = require('node-schedule')
const fs = require('fs')
const path = require('path')
const parser = require('cron-parser')
const moment = require('moment')
moment.locale('zh-CN')

const weatherSchedule = require('./schedule/weather')
const txWorldNews = require('./schedule/txWorldNews')

const scheduleMap = {
  weather: weatherSchedule.weatherSchedule,
  txWorldNews: txWorldNews.getNews,
}

const ymdStr = 'YYYY-MM-DD HH:mm:ss'
const ymdStrOffset = 'YYYY-MM-DD HH:mm:01' // 偏移1秒 用于parser验证

schedule.scheduleJob('* * * * *', async function() {
  console.log('every minute schedule run!')
  let configArr = []
  if (fs.existsSync(path.join(__dirname, './config/config.json'))) {
    configArr = JSON.parse(fs.readFileSync(path.join(__dirname, './config/config.json')))
  }
  if (!configArr.length) {
    throw new Error('config file not found!')
  }

  configArr.forEach(async config => {
    if (!config.cron) {
      throw new Error(`schedule job ${config.script} cron config not found!`)
    }
    const curMin = moment().utcOffset(480).format(ymdStr)
    const interval = parser.parseExpression(config.cron, {
      currentDate: moment().utcOffset(480).format(ymdStrOffset),
    })
    const curCron = moment(interval.prev().toDate()).format(ymdStr)

    if (curMin === curCron) {
      if (scheduleMap[config.script]) {
        await scheduleMap[config.script](config)
      } else {
        throw new Error(`schedule job ${config.script} module and method not found!`)
      }
    }
  })
})