import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';

export function login() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds]
  });
  
  // Register the slash command
  const commands = [
    // verifyUser
    //  Check membership of a user
    {
      name: 'verifyUser',
      description: 'Check if the given Discord user is a registered SJAA member.',
      options: [
        {
          name: 'user',
          type: 'USER',
          description: 'The user to lookup.',
          required: true
        }
      ]
    },

    {
      name: 'registerByEmail',
      description: 'Checks if the given email is an SJAA member, and not already reigstered to another Discord user.  If so, this user is linked to their e-mail and given the Members role.',
      options: [
        {
          name: 'email',
          type: 'STRING',
          description: 'The e-mail address to register.',
          required: true
        }
      ]
    }
  ];
  
  const rest = new REST({ version: '10' }).setToken(token);
  
  (async () => {
    try {
      await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands }
      );
      console.log('Successfully registered application commands.');
    } catch (error) {
      console.error(error);
    }
  })();
  
  client.once('ready', () => {
    console.log('Bot is ready!');
  });
  
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    const { commandName, options } = interaction;
    
    if (commandName === 'lookupuser') {
      const userId = options.getString('userid');
      try {
        const user = await client.users.fetch(userId);
        await interaction.reply(`Username: ${user.username}\nDiscriminator: ${user.discriminator}\nID: ${user.id}`);
      } catch (error) {
        console.error(error);
        await interaction.reply('User not found.');
      }
    }
  });
  
  client.login(process.env.DISCORD_TOKEN);
}
