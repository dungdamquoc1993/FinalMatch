function main() {
  var sheetXuatData = getSheetFromFile(fileStockURL, "Xuất"); // hàm này lấy sheet xuất từ file Stock ra
  for (var day = 1; day <= 31; day++) {
    var dataSheetSaleNotes = getSheetDataFromFile(fileSaleNotesURL, String(day)); //hàm này lấy hết dât từ sale note ra 
    updateDataInFileStock(dataSheetSaleNotes, sheetXuatData, day); // hàm này fill data vào file Stock
  }
  updateSaleRevenues(fileSaleNotesURL); // hàm này update dữ liệu vào Sheet Incentive 
}





