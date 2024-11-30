require('dotenv').config()
const { SlashCommandBuilder, SlashCommandUserOption } = require('discord.js');
const { google_auth, read_spreadsheet } = require('../../utils/google-apis');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Check if the given Discord user is a registered SJAA member.')
    .addUserOption(
      new SlashCommandUserOption()
        .setName('user')
        .setDescription('The user to lookup.')
        .setRequired(true)
        //.setRolePermissions([process.env.DISCORD_VERIFY_ROLE_ID]) // Only allow access to this command for specific roles
    ),
  async execute(interaction) {
    // Implement the action here
    //await interaction.reply('Pong!');

    // Authenticate with google
    const client = await google_auth();
    const data = await read_spreadsheet(client, process.env.MEMBERSHIP_SHEET_ID);
    const discord_index = data[0].findIndex ( value => value == process.env.MEMBERSHIP_SHEET_DISCORD_ID);
    const results = data.slice(1).filter( row => row[discord_index] == interaction.user.id);

    if(results.length == 0) {
      await interaction.reply(`Discord user ${interaction.user.tag} is not a registered member of SJAA.`);
    } else {
      var return_string = '';
      results.forEach(row => return_string = `${return_string}\n${row}`);
      await interaction.reply(`Discord user ${interaction.user.tag} is registered as\n${return_string}`);
    }
  }
};