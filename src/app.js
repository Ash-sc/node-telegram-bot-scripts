const schedule = require('node-schedule')
const fs = require('fs')
const path = require('path')
const parser = require('cron-parser')
const moment = require('moment')

const weatherSchedule = require('./schedule/weather')

const scheduleMap = {
  weather: weatherSchedule.weatherSchedule
}

const ymdStr = 'YYYY-MM-DD HH:mm:ss'

schedule.scheduleJob('* * * * *', async function() {
  console.log('every minute schedule run!')
  let config = {}
  if (fs.existsSync(path.join(__dirname, './config/config.json'))) {
    config = require('./config/config.json')
  }
  if (!Object.keys(config).length) {
    throw new Error('config file not found!')
  }

  Object.keys(config).forEach(async key => {
    if (!config[key].cron) {
      throw new Error(`schedule job ${key} cron config not found!`)
    }
    const interval = parser.parseExpression(config[key].cron)
    const curMin = moment().format(ymdStr)
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