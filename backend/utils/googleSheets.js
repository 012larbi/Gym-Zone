const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Path to your service account key file
// You should get this from Google Cloud Console
const KEYFILEPATH = path.join(__dirname, '..', 'credentials.json');

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuth() {
  if (!fs.existsSync(KEYFILEPATH)) {
    console.warn('⚠️ Google Sheets credentials not found at:', KEYFILEPATH);
    return null;
  }
  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  return auth;
}

/**
 * Sync data to a Google Sheet
 * @param {string} spreadsheetId - The ID of the spreadsheet
 * @param {string} range - The range (e.g. 'Sheet1!A1')
 * @param {Array<Array>} values - 2D array of data
 */
async function syncToSheet(spreadsheetId, range, values) {
  try {
    const auth = await getAuth();
    if (!auth) return;

    const sheets = google.sheets({ version: 'v4', auth });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: { values },
    });

    console.log('✅ Google Sheets synced successfully');
  } catch (err) {
    console.error('❌ Google Sheets sync error:', err.message);
  }
}

module.exports = { syncToSheet };
