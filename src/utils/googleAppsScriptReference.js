
/*
  Google Apps Script Reference 
  ===========================
  
  To use this application with Google Sheets:
  
  1. Create a new Google Sheet with columns: 
     username | blood-glucose | game-score | timestamp
  
  2. Open Script Editor (Extensions > Apps Script)
  
  3. Replace the default code with the following:
  
  -------------------------------------------

  function doGet(e) {
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  function doPost(e) {
    try {
      // Parse the input
      const data = JSON.parse(e.postData.contents);
      
      // Get the active sheet
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      // Add a new row
      sheet.appendRow([
        data.username,
        data.bloodGlucose,
        data.gameScore,
        data.timestamp || new Date().toISOString()
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
        .setMimeType(ContentService.MimeType.JSON);
    } catch(error) {
      return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  function doDelete(e) {
    // Handle delete requests if needed
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  function doPut(e) {
    try {
      // Parse the input
      const data = JSON.parse(e.postData.contents);
      
      // Get the active sheet
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      
      // Get all data
      const values = sheet.getDataRange().getValues();
      
      // Find the row with matching username
      let rowIndex = -1;
      for (let i = 0; i < values.length; i++) {
        if (values[i][0] === data.username) {
          rowIndex = i + 1; // +1 because sheets are 1-indexed
          break;
        }
      }
      
      if (rowIndex > 0) {
        // Update the row
        if (data.bloodGlucose) {
          sheet.getRange(rowIndex, 2).setValue(data.bloodGlucose);
        }
        
        if (data.gameScore) {
          sheet.getRange(rowIndex, 3).setValue(data.gameScore);
        }
        
        return ContentService.createTextOutput(JSON.stringify({ result: "updated" }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ error: "Username not found" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    } catch(error) {
      return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  
  -------------------------------------------
  
  4. Deploy as web app:
     - Click "Deploy" > "New deployment"
     - For "Execute as" select "Me" 
     - For "Who has access" select "Anyone"
     - Click "Deploy"
     
  5. Copy the Web App URL provided and use it to replace "YOUR_ACTUAL_GOOGLE_SCRIPT_ID_HERE" 
     in the following files:
     - src/components/Game/RegistrationScreen.tsx 
     - src/components/Game/GameOverScreen.tsx
  
  Note: Make sure to allow CORS on your Google Apps Script if you encounter issues:
  
  Add this at the top of your Google Apps Script:
  
  function setCorsHeaders(e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  
*/

// This file is for reference only
export {}
