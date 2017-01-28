# ModBot

This is a simple little bot made specifically for liveblogging discord servers.

##Installing and Running ModBot

Currently, the only thing required to run ModBot is a working version of [Node](https://nodejs.org/en/), the main.js file, and a config file with the format provided in botConfigExample.json. The update and command handlers can also be run seperately.

Sample startup:

    node ./main.js ./botConfig.json

While this is the only thing required, [PM2](http://pm2.keymetrics.io/) is recommended in place of nohup to run the bot as a daemon. 

Built using [Discord.js](https://discord.js.org/#/)
