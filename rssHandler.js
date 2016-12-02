var RFE = require('rss-feed-emitter');
var feeder = new RFE();

var Discord = require('discord.js')
var bot = new Discord.Client();
var Config = require(process.argv[2]);

var inArray = require("./util.js").inArray

feeder.add({
	url: Config.rss.url
});

feeder.on('new-item', function(item)
{
	let tags = item.catergories;

	console.log(inArray("mb", tags));
	if (inArray(Config.rss.tag, tags) || inArray("mb", tags))
	{
		bot.channels.find(Config.ids.updatech).sendMessage(`Update! ${item.link}`);
	}
});


bot.login(Config.token);

bot.on('ready', () => {
  console.log('RSS process ready!');
});

