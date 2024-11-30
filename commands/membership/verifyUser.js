const { SlashCommandBuilder, SlashCommandUserOption } = require('discord.js');

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
    await interaction.reply('Pong!')
  }
};