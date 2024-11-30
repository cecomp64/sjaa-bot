const {GoogleAuth} = require('google-auth-library');
const { google } = require('googleapis');

async function google_auth() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  var client = await auth.getClient();

  return client;
}

async function read_spreadsheet(client, sheetId) {
  // Now let's make a request to the Google Sheets API 
  const sheets = google.sheets({version: 'v4', auth: client}); 
  const response = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Sheet1!A1:D5', }); 
  console.log('Data from sheet:', response.data.values);

  return response.data.values;
}

module.exports = { google_auth, read_spreadsheet };