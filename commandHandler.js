var Discord = require('discord.js');
var commands = require("./docs/commands.json");
var Util = require("./util.js")
var Config = require(process.argv[2]);

var bot = new Discord.Client();

'use strict';

var ModBot = ModBot || {};


ModBot.handleCommand = function(msg)
{
    //At the moment ModBot does not act on any non-command messages
    if (!msg.content.startsWith("!"))
        return -1;

    //Grabs the command text and removes the '!'
    var cMatch = msg.content.match(/^(?:!)(\w+)/);

    //Indicates a message that only contains '!'s
    if (!cMatch)
        return -1;

    var command = cMatch [1];

    if (!commands.hasOwnProperty(command))
        return -2;

    var cmd = commands[command];

    var pattern = new RegExp(cmd.reg);

    // Now undeeded, but kept here for possible future use
    // var date = new Date();
    // console.log(`${date.toString()} - '${command}' sent in ${msg.channel.name}: '${msg.content}'`);

    if(!pattern.test(msg.content))
    {
        msg.channel.sendMessage(`**ERROR:** Incorrect parameters! Command format:\n**${cmd.format}**\nType '!help ${command}' for more information.`);

        return -3;
    }

    else
    {
        if (cmd.mod)
        {
            if (!ModBot.denyNonMod(msg))
                return -4;
        }

        if (command === '8ball')
            command = eightBall;

        let prm = msg.content.match(pattern).slice(1);
        let obj = {"msg": msg, "args": prm};

        ModBot[command](obj);


        return 0;
    }
} 

ModBot.denyNonMod = function(msg)
{
    if (!ModBot.checkMod(msg))
    {   
        msg.channel.sendMessage("Only mods can use this command!")
        return false;
    }
    else
    {
        return true;
    }
}

ModBot.checkMod = function(msg)
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

ModBot.eightBall = function(obj)
{
    return;
}

ModBot.birthday = function(obj)
{
    var bdayName = obj.args[0];

    //This section duplicates the last vowel in the
    //name and elongates it
    var vowelRegex = /[aeiouy]/ig
    var vowelMatch;
    var lastVowel;
    var lastVowelIdx;

    while ((vowelMatch = vowelRegex.exec(bdayName)) != null)
    {
        lastVowel = vowelMatch[0];
        lastVowelIdx = vowelMatch.index;
    }

    var longBdayName = bdayName;

    if(lastVowelIdx)
    {
        longBdayName = bdayName.substr(0, lastVowelIdx) + lastVowel.repeat(5) + bdayName.substr(lastVowelIdx);
    }

    var channel = obj.msg.channel;

    channel.sendMessage("Sing along, everyone!\n https://youtu.be/AW3KOB7BnsY");

    // channel.sendMessage(`Happy birthday to you,\n
    //                     Happy birthday to you!\n
    //                     Happy birthday dear ${longBdayName},\n
    //                     Happy birthday to youuuu~`);

    setTimeout(() => channel.sendMessage("**Happy birthday to you,**"), 5000);
    setTimeout(() => channel.sendMessage("**Happy birthday to you!**"), 7000);
    setTimeout(() => channel.sendMessage(`**Happy birthday dear ${longBdayName}**`), 11000);
    setTimeout(() => channel.sendMessage("**Happy birthday to youuuu~**"), 13000);
    setTimeout(() => channel.sendMessage(":tada: :tada: :confetti_ball: :gift: :birthday: :gift: :confetti_ball: :tada: :tada:"), 15000);
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
        obj.msg.channel.sendMessage(`**${cmd.format}**\n\n${cmd.long}`);
    }
}

ModBot.roll = function(obj)
{

    let args = obj.args;

    //Rolls 1d20 if no other dice have been specified
    if (!args[1])
    {
        let num = Util.getRandomIntInclusive(1, 20);
        obj.msg.channel.sendMessage(`\`\`\`d20 Result: ${num}\`\`\``);
        return;
    }

    let dice = parseInt(args[1]);
    let numDice = parseInt(args[0]);

    let add = parseInt(args[3])

    if(!add)
    {
        add = 0
    }

    if (numDice > 10)
    {
        obj.msg.channel.sendMessage("ERROR: I can't roll that many dice!");
        return;
    }

    if (dice > 500)
    {
        obj.msg.channel.sendMessage("ERROR: I couldn't roll a die that big if I wanted to!");
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

    //'+' symbol stored in args[2] if it is present
    if (args[2])
        output += "\n Sum: " + sum + "\n";

    output += "```"

    obj.msg.channel.sendMessage(output);
}

ModBot.timeout = function(obj)
{
    //Message should have order "!timeout [time] [user mention]"

    let time = parseInt(obj.args[0]);
    console.log(obj.msg.mentions.users.first());
    let member = obj.msg.guild.member(obj.msg.mentions.users.first());
    

    member.addRole(Config.ids.badid);
    obj.msg.channel.sendMessage("User **" + member.toString() + "** has been placed in timeout for **" + time + "** minutes.")

    let timeSec = time * 1000 * 60;
    setTimeout(function()
    {
        member.removeRole(Config.ids.badid);
        console.log("User has been removed from timout")
    }
    , timeSec);
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
    let botRole = msg.guild.member(bot.user).highestRole;

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

bot.on("message", msg => 
{
    ModBot.handleCommand(msg);
});

bot.login(Config.token)

bot.on('ready', () => {
  console.log('Command process ready!');
});

//Permissions: 0x10000c20