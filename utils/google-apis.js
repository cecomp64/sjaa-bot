const {GoogleAuth} = require('google-auth-library');
const { google } = require('googleapis');
const { compute_row } = require('./helpers');

async function google_auth() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  var client = await auth.getClient();

  return client;
}

async function read_spreadsheet(client, sheetId, range) {
  // Now let's make a request to the Google Sheets API 
  const sheets = google.sheets({version: 'v4', auth: client}); 
  const response = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: range, }); 
  console.log('Data from sheet:', response.data.values);

  return response.data.values;
}

async function write_spreadsheet(client, sheetId, range, values) {
  const sheets = google.sheets({version: 'v4', auth: client});
  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'RAW',
      requestBody: {
        majorDimension: 'ROWS',
        values: values
      },
    });
    console.log(`${response.data.updatedCells} cells updated.`);
  } catch (err) {
    console.error('Error writing to sheet:', err);
  }
}

module.exports = { google_auth, read_spreadsheet, write_spreadsheet };