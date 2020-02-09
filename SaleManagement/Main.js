var fileStockURL = "https://docs.google.com/spreadsheets/d/1btPTB-yRSscvs00mYQnnFcyeeTJbjgPOovZd0kz0Dj0/edit#gid=1519051753";
var fileSaleNotesURL = "https://docs.google.com/spreadsheets/d/1iY3AyYppDe6GHJeWww56ILhq8G9iHdDJbmpTs4LJuUY/edit#gid=981403088";
function main() {
  var sheetXuatData = getSheetDataFromFile(fileStockURL, "Xuất");
  var numberOfDays = 31;
  for (var day = 1; day <= numberOfDays; day++) {
    var dataOfSaleNotes = getDataFromSaleNotes(fileSaleNotesURL, String(day));
    updateDataInFileStock(dataOfSaleNotes, sheetXuatData, day);
  }
}





