function getSheetFromFile(fileURL, sheetName) {
    const allSheets = SpreadsheetApp.openByUrl(fileURL);
    SpreadsheetApp.setActiveSpreadsheet(allSheets);
    var sheet = allSheets.getSheetByName(sheetName);
    if(sheet == null) {
      Logger.log("sheetname = "+sheetName+" is NULL");
      return sheet;
    }
    sheet.activate();
    return sheet;
}

function getSheetDataFromFile(fileURL, sheetName) {
    var sheet = getSheetFromFile(fileURL, sheetName);
    if(sheet == null){
      return null;
    }
    var data = sheet.getDataRange().getValues();
    return data
}