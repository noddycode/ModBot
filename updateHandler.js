var Discord = require('discord.js');
var fs = require('fs');
var request = require('request');
var rp = require('request-promise');
var cheerio = require('cheerio');
var Config = require(process.argv[2]);
var Util = require("./util.js");
var Promise = require('bluebird');
var Tumblr = require('tumblr.js');

var bot = new Discord.Client();
var user = Config.update.username;
var tag = Config.update.tag;
var updateChannel;
var refresh = parseInt(Config.update.refresh);

var ModBot = ModBot || {};

ModBot.UpdateHandler = class
{
	constructor(key, secret, bot)
	{
		let authObject = 
		{
			credentials:
			{
				consumer_key: key,
				consumer_secret: secret
			},
			returnPromises: true
		}

		this.bot = bot;
		this.client = new Tumblr.Client(authObject);
		this.lastUpdate;
	}

	init()
	{
		return this.client.blogPosts(user, {limit:1})
		.then(function(response)
		{
			this.lastUpdate = Number(response.posts[0].id);
		}.bind(this));
	}

	update()
	{
		
		return this.client.blogPosts(user, {limit: 10, tag: tag})
		.then(function(response)
		{
			//Grabs all new posts (up to 10) that have been made since the last update
			var newPosts = response.posts.filter(function(post)
			{
				return post.id > this.lastUpdate;
			}.bind(this));

			if (newPosts.length <= 0)
			{
				return;
			}

			//Reverses posts so that they will be in chronological order
			newPosts.reverse()

			newPosts.forEach(function(post)
			{
				updateChannel.sendMessage(`**Update:** ${post.post_url}`)
				//Should be the most recent post by the end of this loop
				this.lastUpdate = Number(post.id);
			}.bind(this));

		}.bind(this));
	}

	getNewPosts()
	{
		this.update();
		setInterval(() => this.update(), refresh);
	}

}

// //Gets the latest post id when the bot is started
// var getInitialPost = function()
// {
// 	return rp(
// 			//Options here request the iphone6 version of the page to give us a standard theme to reliably scrape
// 			//Note that any participating blogs MUST have the default mobile view enabled for this to work
// 			{
// 				uri: Config.update.url,
// 				headers: {
// 					'User-Agent': 'Apple-iPhone7C2/1202.466'
// 				}
// 			}
// 		)
// 		.then(function(html)
// 		{
// 			var $ = cheerio.load(html);
// 			let post = getPostList($)[0];
// 			return getID(post.url);
// 		})
// 		.catch(function(err)
// 		{
// 			console.log("Could not reach webpage, exiting...");
// 			process.exit();
// 		});
// }

// function getPostList($)
// {
// 	var json = $("[type = 'application/ld+json']", "head").text();

// 	var posts = JSON.parse(json).itemListElement;

// 	return posts;
// }

// function getID(url)
// {
// 	let res = url.split('/');
// 	return res[4];
// }

// var update = function ()
// {
// 	rp(	
// 			//Options here request the iphone6 version of the page to give us a standard theme to reliably scrape
// 			//Note that any participating blogs MUST have the default mobile view enabled for this to work
// 			{
// 				uri: Config.update.url,
// 				headers: {
// 					'User-Agent': 'Apple-iPhone7C2/1202.466'
// 				}
// 			}
// 		)
// 	.then( html =>
// 	{
// 		var $ = cheerio.load(html);
// 		let posts = getPostList($);
// 		if (posts.length <= 0)
// 			return;

// 		let postStack = []; //Stack is used in case there are multiple posts between refreshes

// 		posts.some(function(p) 
// 		{
// 			// Breaks once function is caught up to last update
// 			if (getID(p.url) === lastPost)
// 			{
// 				return true;
// 			}

// 			//get the post id for further processing
// 			let id = getID(p.url);

// 			let tags = [];
// 			$(".tag-link", `.post-${id}`).each(function() 
// 				{
// 					tags.push($(this).text());
// 				});

// 			if (tags.length <= 0)
// 				return false;

// 			let comp = Util.inArray(tags, Config.update.tags);
			
// 			if(comp)
// 			{
// 				postStack.push(p.url);
// 			}

// 			return false;

// 		});

// 		if (postStack.length <= 0)
// 			return;

// 		lastPost = getID(postStack[0]);
// 		while (postStack.length > 0)
// 		{
// 			updateChannel.sendMessage(`**Update**: ${postStack.pop()}`);
// 			console.log("Blog updated");
// 		}

		
// 	})
// 	.catch(function(err)
// 	{
// 		console.log(`ERROR: Could not get webpage: '${err}'`);
// 	});
// }

// var getNewPosts = function()
// {
// 	update();
// 	setInterval(update, refresh);
// }

// var handleReq = function(){request(Config.update.url, getNewPosts)};

bot.login(Config.token)

bot.on('ready', () => {
	var udh = new ModBot.UpdateHandler(Config.update.tumblr_token, Config.update.tumblr_secret, bot);
	updateChannel = bot.channels.get(Config.ids.updatech);
	udh.init()
	.then(() => console.log('Updater process ready!'))
	.then(() => udh.getNewPosts());

  // getInitialPost().then(val => 
  // 	{
  // 		lastPost = val;
  // 		getNewPosts()
  // 	});
});
