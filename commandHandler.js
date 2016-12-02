var Discord = require("./node_modules/discord.js");
var Config = require(process.argv[2] ||"./botConfig.json")
var bot = new Discord.Client();
const ballAnswers = ["Yes", "No", "Go with your gut",
 "pls no", "Absolutely", "I mean... sure?",
 "Try again later", "Maybe not"];

bot.on("message", msg => {
	let cont = msg.content;

	// if (cont.startsWith(">"))
	// {
	// 	handleGreenText(msg);
	// 	return
	// }

	if (!cont.startsWith("!"))
	{
		return;
	}

	if (cont.startsWith("!8ball")) handle8ball(msg);

	if (cont.startsWith("!roll")) handleRollDice(msg);

    else if (cont.startsWith("!timeout"))
    {
    	if (!denyNonMod(msg)) return;
    	handleTimeout(msg);
    }

    else if (cont.startsWith("!lock"))
    {
    	if (!denyNonMod(msg)) return;
    	handleLock(msg, false);
    }

    else if (cont.startsWith("!unlock"))
    {
    	if (!denyNonMod(msg)) return;
    	handleLock(msg, true);
    }
});

function checkMod(msg)
{
	let botRole = msg.guild.member(bot.user).highestRole;
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


function denyNonMod(msg)
{
	if (!checkMod(msg))
	{	
		msg.channel.sendMessage("Only mods can use this command!")
		return false;
	}
	else
	{
		return true;
	}
}

var getType = function (elem) 
{
  return Object.prototype.toString.call(elem).slice(8, -1);
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleRollDice(msg)
{
	let cont = msg.content;
	let res = cont.split(" ");
	let dice = parseInt(res[1]);
	let numDice = NaN;

	if (res.length >= 3) numDice = parseInt(res[2]);
	else numDice = 1;

	if (res.length < 2 || res.length > 4 || !dice || !numDice)
	{
		msg.channel.sendMessage("ERROR: Incorrect parameters!\nCommand should be in the form \"**!roll [highest value of dice] [how many rolls (optional)] [\"add\" (optional)]**\"")
		return;
	}

	if (numDice > 10)
	{
		msg.channel.sendMessage("ERROR: I can't roll that many dice!")
		return;
	}

	let output = "```\n";

	let sum = 0;

	for (let i = 0; i < numDice; i++)
	{
		let num = getRandomIntInclusive(1, dice);
		sum += num;
		let temp = "Roll " + (i + 1) +": " + num + "\n";
		output += temp;
	}

	if (res[3] === "add") output += "\n Sum: " + sum + "\n";

	output += "```"

	msg.channel.sendMessage(output);

}

function handleTimeout(msg)
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

function handleLock(msg, newVal)
{
	let chan = msg.mentions.channels.first();

	if (!chan)
	{
		msg.channel.sendMessage("ERROR: Incorrect parameters!\nCommand should be in the form \"**!lock [channel mention]**\"");
		return;
	}

	let roles = msg.guild.roles;

	if (!newVal)
		chan.sendMessage("This channel has been locked!");

	let botRole = msg.guild.member(bot.user).highestRole;
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

function handle8ball(msg)
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


bot.on('ready', () => {
  console.log('I am ready!');
});


bot.login(Config.token);

//Permissions: 0x10000c20