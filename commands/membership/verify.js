require('dotenv').config()
const { SlashCommandBuilder, SlashCommandUserOption } = require('discord.js');
const { google_auth, read_spreadsheet } = require('../../utils/google-apis');
const { find_discord_user } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Check if the given Discord user is a registered SJAA member.')
    .addUserOption(
      new SlashCommandUserOption()
        .setName('user')
        .setDescription('The user to lookup.')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check that the user has the right role to issue this command
    console.log(`roles: ${interaction.member.roles}`)
    const role = interaction.member.roles.find(r => r == process.env.DISCORD_VERIFY_ROLE_ID)

    if (!role) { 
      return interaction.reply({ content: 'You do not have permissions to execute this command.', ephemeral: true }); 
    }

    // Authenticate with google
    const client = await google_auth();
    const data = await read_spreadsheet(client, process.env.MEMBERSHIP_SHEET_ID, process.env.MEMBERSHIP_SHEET_RANGE);
    const results = find_discord_user(data, interaction.user.id);

    if(results.length == 0) {
      await interaction.reply({
        content: `Discord user ${interaction.user.tag} is not a registered member of SJAA.`,
        ephemeral: true,
      });
    } else {
      var return_string = '';
      results.forEach(row => return_string = `${return_string}\n${row}`);
      await interaction.reply({
        content: `Discord user ${interaction.user.tag} is registered as\n${return_string}`,
        ephemeral: true,
      });
    }
  }
};