//	deploy-commands.js
//		ARGS: [global]
//
//	Refresh your applications '/' commands.  If the global argument is passed in,
//	this operates on all instances.  Otherwise, it operates on env.DISCORD_TEST_SERVER
require('dotenv').config()
const { REST, Routes } = require('discord.js');

// Grab important environment variables
clientId = process.env.DISCORD_CLIENT_ID;
token = process.env.DISCORD_TOKEN;
guildId = process.env.DISCORD_TEST_SERVER;

// Process command-line arguments
args = process.argv.slice(2);
global_deploy = args[0] == 'global';

if(global_deploy) console.log('Deploying Globally');
else console.log('Deploying to guildId: ', guildId);

// Grab all the commands defined in this app
const commands = require('./utils/command-finder');
console.log('Commands: ', Array.from(commands.keys()));

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.size} application (/) commands.`);

		// For development, only apply to a test server
		var route = global_deploy ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			route,
			{ body: commands.map( value => value.data.toJSON() ) },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();