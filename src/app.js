const schedule = require('node-schedule')
const fs = require('fs')
const path = require('path')
const parser = require('cron-parser')
const moment = require('moment')
moment.locale('zh-CN')

const weatherSchedule = require('./schedule/weather')

const scheduleMap = {
  weather: weatherSchedule.weatherSchedule,
  weatherTomorrow: (config) => weatherSchedule.weatherSchedule(config, 1)
}

const ymdStr = 'YYYY-MM-DD HH:mm:ss'
const ymdStrOffset = 'YYYY-MM-DD HH:mm:01' // 偏移1秒 用于parser验证

schedule.scheduleJob('* * * * *', async function() {
  console.log('every minute schedule run!')
  let config = {}
  if (fs.existsSync(path.join(__dirname, './config/config.json'))) {
    config = JSON.parse(fs.readFileSync(path.join(__dirname, './config/config.json')))
  }
  if (!Object.keys(config).length) {
    throw new Error('config file not found!')
  }

  Object.keys(config).forEach(async key => {
    if (!config[key].cron) {
      throw new Error(`schedule job ${key} cron config not found!`)
    }
    const curMin = moment().utcOffset(480).format(ymdStr)
    const interval = parser.parseExpression(config[key].cron, {
      currentDate: moment().utcOffset(480).format(ymdStrOffset),
    })
    const curCron = moment(interval.prev().toDate()).format(ymdStr)

    if (curMin === curCron) {
      if (scheduleMap[key]) {
        console.log(scheduleMap[key])
        await scheduleMap[key](config[key])
      } else {
        throw new Error(`schedule job ${key} module and method not found!`)
      }
    }
  })
})