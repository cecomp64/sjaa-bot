require('dotenv').config()
const http = require('http');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require('discord.js');
const commands = require('./utils/command-finder')
const token = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Set slash commands in client
client.commands = commands;

// Handle events from the events folder
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord and start listening for commands
client.login(token);

// Spawn a dummy server for Render free web service workaround.
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Hello, world!\n');
}).listen(3000);

console.log('Dummy Server Started');