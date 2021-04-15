# node-telegram-bot-scripts

> 这是一个telegram机器人脚本，支持：“天气预报机器人（中国境内）”

---

## 如何使用

### 1. 开发模式
1. 新建并修改src/config/config.json
2. `npm install && npm start`

### 2. docker
1. `npm run build`
2. `docker run -itd -v 宿主机配置目录:/home/service/src/config --name telegram-bot ash/telegram-bot`
3. 宿主机配置目录新建config.json文件并修改

## config.json格式

``` js
[
  {
    "script": "weather", // 指定脚本名称 weather为天气机器人
    "dayOffset": 1, // 天气机器人支持的参数 默认为0今天 1为明天 2为后天 最多支持至2
    "note": "明日天气", // 备注，可不写
    "cron": "0 6 * * *", // cron时间 最多支持到分钟
    "gdKey": "xxxx", // 高德地图web api key
    "city": "361102", // 城市编码 可参照 https://lbs.amap.com/api/webservice/download
    "chatId": "-xxxxx", // telegram频道id，可通过添加 raw_data_bot 到群组获得
    "botToken": "xxxxx", // telegram机器人token，从BotFather处获得
    "httpProxy": { // http代理，便于墙内服务使用
      "host": "127.0.0.1",
      "port": "18080"
    }
  },
  ...
]
```
## 1. 天气预报机器人

可以定时汇报天气（今日 / 明日），使用高德地图api，汇报内容包括，当日天气、气温、风向以及风级、穿衣建议。

需在config.json中指定：
1. `"script": "weather"`
2. 如果需要获取明天/后天天气，需设置`"dayOffset"`

示例：   

<img src="https://raw.githubusercontent.com/Ash-sc/node-telegram-bot-scripts/main/weather-bot.png" alt="示例图片" width="400"/>

   
END.
