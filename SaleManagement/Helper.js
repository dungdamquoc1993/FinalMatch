function getSheetFromFile(fileURL, sheetName) {
    const allSheets = SpreadsheetApp.openByUrl(fileURL);
    SpreadsheetApp.setActiveSpreadsheet(allSheets);
    var sheet = allSheets.getSheetByName(sheetName);
    sheet.activate();
    return sheet;
}
function getSheetDataFromFile(fileURL, sheetName) {
    var sheet = getSheetFromFile(fileURL, sheetName);
    var data = sheet.getDataRange().getValues();
    return data
}