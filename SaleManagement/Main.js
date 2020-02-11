function main() {
  var sheetXuatData = getSheetFromFile(fileStockURL, "Xuất");
  for (var day = 1; day <= 31; day++) {
    var dataSheetSaleNotes = getSheetDataFromFile(fileSaleNotesURL, String(day));
    updateDataInFileStock(dataSheetSaleNotes, sheetXuatData, day);
  }
  updateSaleRevenues(fileSaleNotesURL);
}





