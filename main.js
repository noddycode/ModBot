const ChildProcess = require("child_process");

var fs = require("fs");

var cName = process.argv[2]; //Should be a config file

cName = cName.replace(/\\/g,"\/") //Changes Windows path strings to Unix-like path

//Error checking for config file
try
{
	fs.accessSync(cName, fs.R_OK);

} catch (e)
{
	if (e instanceof TypeError)
		cName = "./botConfig.json";

	else if (e.message.startsWith("ENOENT"))
	{
		console.log(`ERROR: File '${cName}' could not be read`);
		process.exit();
	}

	else
	{
		console.log(`Loading error: ${e}`);
		process.exit();
	}
}

if (!cName.endsWith(".json"))
{
	console.log(`ERROR: '${cName}' is not a valid .json file`)
	process.exit();
}

//var Config = require(process.argv[2] ||"./botConfig.json");

const ch = ChildProcess.fork("./commandHandler.js", [cName]);
const update = ChildProcess.fork("./updateHandler.js", [cName]);