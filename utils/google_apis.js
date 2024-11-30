import {GoogleAuth} from 'google-auth-library';
import { google } from 'googleapis'; 

export async function google_auth() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  var client = await auth.getClient();

  return client;
}

export async function test_google_login() {
  // Make sure to share the spreadsheet with the service account!  
  const sheetId = "1cfjvCEQ1sYhLaqN1BxWM4LMPRx4xNPwRT4egD9BE2r8";

  try {
    var client = await authenticate();
    read_spreadsheet(sheetId, client);
  } catch(error) {
    console.error('Authentication failed: ', error);
  }
}

export async function read_spreadsheet(sheetId, client) {
  // Now let's make a request to the Google Sheets API 
  const sheets = google.sheets({version: 'v4', auth: client}); 
  const response = await sheets.spreadsheets.values.get({ spreadsheetId: sheetId, range: 'Sheet1!A1:D5', }); 
  console.log('Data from sheet:', response.data.values);

}