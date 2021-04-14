FROM keymetrics/pm2:latest-alpine
 
RUN mkdir -p /home/service
WORKDIR /home/service
COPY . /home/service

ENV NPM_CONFIG_LOGLEVEL warm

RUN npm install --unsafe-perm=true --dd

EXPOSE 3000

CMD [ "pm2-runtime", "start", "pm2.json"]