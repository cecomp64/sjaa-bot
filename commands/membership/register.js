require('dotenv').config()
const { SlashCommandBuilder, SlashCommandStringOption } = require('discord.js');
const { google_auth, read_spreadsheet, write_spreadsheet } = require('../../utils/google-apis');
const { compute_column, find_discord_user } = require('../../utils/helpers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register yourself against the SJAA membership database.')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('email')
        .setDescription('Your email - used for lookup agains the SJAA member database.')
        .setRequired(true)
        //.setRolePermissions([process.env.DISCORD_VERIFY_ROLE_ID]) // Only allow access to this command for specific roles
    ),
  async execute(interaction) {
    // Implement the action here
    //await interaction.reply('Pong!');

    // Authenticate with google
    const client = await google_auth();
    const email = interaction.options.getString('email').trim();

    // Read the spreadsheet
    const data = await read_spreadsheet(client, process.env.MEMBERSHIP_SHEET_ID, process.env.MEMBERSHIP_SHEET_RANGE);
    const discord_index = data[0].findIndex ( value => value == process.env.MEMBERSHIP_SHEET_DISCORD_ID);
    const id_index = data[0].findIndex ( value => value == process.env.MEMBERSHIP_SHEET_INTERNAL_ID);

    // Find any users already registered
    const already_registered = find_discord_user(data, interaction.user.id);

    if(already_registered.length > 0) {
      var return_string = '';
      already_registered.forEach(row => return_string = `${return_string}\n${row}`);
      console.log(`Discord user ${interaction.user.tag} (${interaction.user.id}) already registered to:\n${return_string}`)
      await interaction.reply({
        content: `Discord user ${interaction.user.tag} is already registered to ${already_registered[0][id_index]}.`,
        ephemeral: true,
      });
      return;
    }

    // If not already registered, then look for an e-mail match
    var matching_row_index = data.findIndex( row => {
      // Find rows that match the e-mail and are not already registered to another discord user
      const discord_id = row[discord_index];
      console.log(`row[${id_index}]: ${row[id_index]}, discord_id: ${discord_id}`);
      return (row[id_index] == email && (!discord_id || discord_id.trim() === ''));
    });

    console.log(`discord_index: ${discord_index}, id_index: ${id_index}, matching_row_index: ${matching_row_index}, email: ${email}`)

    if(matching_row_index >= 0) {
      // Compute which row needs to be replaced
      var values = [];
      var column = compute_column(discord_index);
      var range = `${process.env.MEMBERSHIP_SHEET_RANGE}!${column}${matching_row_index+1}`
      values.push([interaction.user.id]);
      console.log(`range: ${range}, values: ${values}`)

      await write_spreadsheet(client, process.env.MEMBERSHIP_SHEET_ID, range, values);
      await interaction.reply({
        content: `Discord user ${interaction.user.tag} registered to ${email}.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `No member found with e-mail ${email}`,
        ephemeral: true,
      });
    }
  }
};