function getSheetFromFile(fileURL, sheetName) {
    const fileStock = SpreadsheetApp.openByUrl(fileURL);
    SpreadsheetApp.setActiveSpreadsheet(fileStock);
    var sheet = fileStock.getSheetByName(sheetName);
    sheet.activate();
    return sheet;
}
function updateDataInFileStock(dataOfSaleNotes, sheet, myDay) {
    var dataOfFileStock = sheet.getDataRange().getValues();
    var rowIndex = 0;
    var filteredData = filterSaleNotes(dataOfSaleNotes)
    while (rowIndex < dataOfFileStock.length) {
      var day = -1;
      for (var columnIndex = 0; columnIndex < dataOfFileStock[rowIndex].length; columnIndex++) {
        var tenSanPham = dataOfFileStock[rowIndex][0];
        var size = typeof dataOfFileStock[1][columnIndex] == 'string' ? 0 : dataOfFileStock[1][columnIndex];
        if (typeof dataOfFileStock[0][columnIndex] == 'object') {
          day = dataOfFileStock[0][columnIndex].getDate();
        }
  
        if (Object.keys(filteredData).length > 0) {
          var key = tenSanPham + ":" + String(size)
          if (filteredData[key] && day == myDay) {
            Logger.log({ "rowIndex": rowIndex, "columnIndex": columnIndex, value: filteredData[key] });
            var cell = sheet.getRange(rowIndex + 1, columnIndex + 1)
            cell.setValues([[filteredData[key]]])
            cell.setBackground("red");
          }
        }
      }
      rowIndex++;
    }
  }