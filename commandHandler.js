var BotClass = require("./botClass.js");
var bot = new BotClass.Bot();

'use strict';

const ballAnswers = ["Yes", "No", "Go with your gut",
 "pls no", "Absolutely", "I mean... sure?",
 "Try again later", "Maybe not"];

bot.bot.on("message", msg => {
	let cont = msg.content;

	if (!cont.startsWith("!"))
	{
		return;
	}

	if (cont.startsWith("!8ball")) bot.handle8ball(msg);
	else if (cont.startsWith("!roll")) bot.handleRollDice(msg);

	
    
    else if (cont.startsWith("!timeout"))
    {
    	if (!bot.denyNonMod(msg)) return;
    	bot.handleTimeout(msg);
    }

    else if (cont.startsWith("!lock"))
    {
    	if (!bot.denyNonMod(msg)) return;
    	bot.handleLock(msg, false);
    }

    else if (cont.startsWith("!unlock"))
    {
    	if (!bot.denyNonMod(msg)) return;
    	bot.handleLock(msg, true);
    }
});


bot.bot.on('ready', () => {
  console.log('Command process ready!');
});

//Permissions: 0x10000c20