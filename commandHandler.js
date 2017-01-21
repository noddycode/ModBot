var BotClass = require("./botClass.js");
var bot = new BotClass.Bot();
var commands = require("./docs/commands.json");

'use strict';

var ModBot = ModBot || {};


ModBot.handleCommand = function(msg)
{
    //At the moment ModBot does not act on any non-command messages
    if (!msg.content.startsWith("!"))
        return -1;

    //Grabs the command text and removes the '!'
    var command = msg.content.match(/^(?:!)(\w+)/)[1];

    if (!commands.hasOwnProperty(command))
        return -2;

    var cmd = commands[command];

    var pattern = new RegExp(cmd.reg);

    if(!pattern.test(msg.content))
    {
        msg.channel.sendMessage(`**ERROR:** Incorrect parameters! Command format:\n**${cmd.format}**\nType '!help ${command}' for more information.`);

        return -3;
    }

    else
    {
        if (command === '8ball')
            command = eightBall;

        let prm = msg.content.match(pattern).slice(1);
        let obj = {"msg": msg, "args": prm};

        ModBot[command](obj);

        return 0;
    }

    //NOTE: Use Object.defineProperty()

} 

ModBot.eightBall = function(obj)
{
    return;
}

ModBot.help = function(obj)
{
    //!help with no arguments 
    if (!obj.args[0])
    {
        let tmp = "List of commands. '[]'s indicate optional parameters:"
        for (var c in commands)
        {
            if(!commands.hasOwnProperty(c))
                continue;

            tmp += `\n\n**${commands[c].format}** - ${commands[c].desc}`
        }

        obj.msg.channel.sendMessage(tmp);
    }

    else
    {
        if(!commands.hasOwnProperty(obj.args[0]))
        {
            obj.msg.channel.sendMessage(`**ERROR:** Command '${obj.args[0]}' not found`)
            return;
        }

        let cmd = commands[obj.args[0]];
        obj.msg.channel.sendMessage(`**${cmd.format}**\n\n${cmd.long}`)   
    }
}

ModBot.lock = function(obj)
{
    ModBot.handleLock(obj.msg, false);
}

ModBot.unlock = function(obj)
{
    ModBot.handleLock(obj.msg, true);
}

//Placed in a separate command to prevent redundant code
ModBot.handleLock = function(msg, newVal)
{
    let chan = msg.mentions.channels.first();
    let roles = msg.guild.roles;
    let botRole = msg.guild.member(bot.bot.user).highestRole;

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

bot.bot.on("message", msg => {
	let cont = msg.content;

    ModBot.handleCommand(msg);

	// if (!cont.startsWith("!"))
	// {
	// 	return;
	// }

	// if (cont.startsWith("!8ball")) bot.handle8ball(msg);
	// else if (cont.startsWith("!roll")) bot.handleRollDice(msg);

	
    
 //    else if (cont.startsWith("!timeout"))
 //    {
 //    	if (!bot.denyNonMod(msg)) return;
 //    	bot.handleTimeout(msg);
 //    }

 //    else if (cont.startsWith("!lock"))
 //    {
 //    	if (!bot.denyNonMod(msg)) return;
 //    	bot.handleLock(msg, false);
 //    }

 //    else if (cont.startsWith("!unlock"))
 //    {
 //    	if (!bot.denyNonMod(msg)) return;
 //    	bot.handleLock(msg, true);
 //    }
});


bot.bot.on('ready', () => {
  console.log('Command process ready!');
});

//Permissions: 0x10000c20