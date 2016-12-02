var Discord = require("./node_modules/discord.js");
var Config = require(process.argv[2]);
var Util = require("./util.js");
var getConfig = Util.getConfig;

class Bot {
	constructor()
	{
		this._bot = new Discord.Client();
		this._bot.login(Config.token);
	}

	get bot()
	{
		return this._bot;
	}

	checkMod(msg)
	{
		let botRole = msg.guild.member(this.bot.user).highestRole;
		let comp = botRole.comparePositionTo(msg.member.highestRole)
		if (comp <= 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	denyNonMod(msg)
	{
		if (!this.checkMod(msg))
		{	
			msg.channel.sendMessage("Only mods can use this command!")
			return false;
		}
		else
		{
			return true;
		}
	}

	handleRollDice(msg)
	{
		let cont = msg.content;
		let res = cont.split(" ");

		if (res.length === 1)
		{
			let num = Util.getRandomIntInclusive(1, 20);
			msg.channel.sendMessage(`\`\`\`d20 Result: ${num}\`\`\``);
			return;
		}

		let rolls = res[1].split(/d|\+/);

		let dice = parseInt(rolls[1]);
		let numDice = parseInt(rolls[0]);

		let add = parseInt(rolls[2])
		if(!add)
		{
			add = 0
		}

		if (res.length !== 2 || !dice || !numDice)
		{
			msg.channel.sendMessage("ERROR: Incorrect parameters! (use just \"!roll\" to roll a d20)\nCommand should be in the form \"**!roll [#of rolls]d[#highest value of die][+ (optional)][# to add (optional)]**\"")
			return;
		}

		if (numDice > 10)
		{
			msg.channel.sendMessage("ERROR: I can't roll that many dice!");
			return;
		}

		if (dice > 500)
		{
			msg.channel.sendMessage("ERROR: I couldn't roll a die that big if I wanted to!");
			return;
		}

		let output = "```\n";

		let sum = 0;

		for (let i = 0; i < numDice; i++)
		{
			let num = Util.getRandomIntInclusive(1, dice);
			sum += num;
			let temp = "Roll " + (i + 1) +": " + num + "\n";
			output += temp;
		}

		sum += add;

		if (res[1].includes('+'))
			output += "\n Sum: " + sum + "\n";

		output += "```"

		msg.channel.sendMessage(output);

	}

	handleTimeout(msg)
	{
		//Message should have order "!timeout [time] [user mention] [reason(optional)]"
		let res = msg.content.split(" ");
		let usrs = msg.mentions.users;
		let time = parseInt(res[1]);

		if (res.length != 3 || usrs.first() === undefined || time === NaN )
		{
			msg.channel.sendMessage("ERROR: Incorrect parameters!\nCommand should be in the form \"**!timeout [time] [user mention]**\"");
			return;
		}
		else
		{
			let member = msg.guild.member(usrs.first())
			member.addRole(Config.ids.badid);
			msg.channel.sendMessage("User **" + member.toString() + "** has been placed in timeout for **" + time + "** minutes.")
			let timeSec = time * 1000 * 60;
			setTimeout(function()
			{
				member.removeRole(Config.ids.badid);
				console.log("User has been removed from timout")
			}
			, timeSec);
		}
	}

	handleLock(msg, newVal)
	{
		let chan = msg.mentions.channels.first();

		if (!chan)
		{
			msg.channel.sendMessage("ERROR: Incorrect parameters!\nCommand should be in the form \"**!lock [channel mention]**\"");
			return;
		}

		let roles = msg.guild.roles;

		let botRole = msg.guild.member(this.bot.user).highestRole;

		if (!newVal)
			chan.sendMessage("This channel has been locked!");
		
		roles.forEach(role =>
		{
			if (botRole.comparePositionTo(role) > 0)
			{
				chan.overwritePermissions(role, {'SEND_MESSAGES': newVal});
				
			}
		});

		if (newVal)
			chan.sendMessage("This channel is now unlocked!");
	}

	handle8ball(msg)
	{
		let res = msg.content.split(" ");
		if (res.length < 2)
		{
			msg.channel.sendMessage("You didn't ask me anything!");
			return;
		}
		let rand = ballAnswers[Math.floor(Math.random() * ballAnswers.length)];
		msg.channel.sendMessage("**The Great ModBot says: **\"" + rand +"\"");
	}
}

exports.Bot = Bot;