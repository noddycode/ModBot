# NOTICE: ModBot is being rewritten in Python as part of the project [Cobber-9000](https://github.com/noddycode/Cobber-9000). Please look there for further updates.

## ModBot

This is a simple little bot made specifically for liveblogging discord servers. Please note that this bot is in its early stages and major changes are likely to occur in the future.

## Installing and Running ModBot

Currently, the only thing required to run ModBot is a working version of [Node](https://nodejs.org/en/), the main.js file, and a config file with the format provided in botConfigExample.json. The update and command handlers can also be run seperately.

Sample startup:

    node ./main.js ./botConfig.json

[PM2](http://pm2.keymetrics.io/) is recommended in place of nohup to run the bot as a daemon.

## Permissions

To run properly, any bots running this code should have the following permissions:
* Manage Server
* Manage Roles
* Read Messages
* Send Messages

More permissions may be required as the bot is developed.

Built using [Discord.js](https://discord.js.org/#/)
