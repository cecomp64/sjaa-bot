require('dotenv').config()
const { REST, Routes } = require('discord.js');

// Grab important environment variables
clientId = process.env.DISCORD_CLIENT_ID;
token = process.env.DISCORD_TOKEN;
guildId = process.env.DISCORD_TEST_SERVER;

// Grab all the commands defined in this app
const commands = require('./utils/command-finder')

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();