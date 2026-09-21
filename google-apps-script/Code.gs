/**
 * Google Apps Script Web App that appends trivia results to a Google Sheet.
 *
 * Setup:
 * 1. Create a new Google Sheet (add header row: Timestamp, Player Name, Score,
 *    Total Questions, Answers).
 * 2. In the Sheet, open Extensions > Apps Script.
 * 3. Replace the default Code.gs contents with this file.
 * 4. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the deployment URL and set it as NUXT_PUBLIC_GAS_URL in your .env.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const params = e.parameter;

  sheet.appendRow([
    params.submittedAt || new Date().toISOString(),
    params.playerName || '',
    params.score || '',
    params.totalQuestions || '',
    params.answers || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
