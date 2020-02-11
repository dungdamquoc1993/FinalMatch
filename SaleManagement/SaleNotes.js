function filterSaleNotes(data) {
  var filteredData = {};
  var rowIndex = 0;
  while (rowIndex < data.length) {
      if (data[rowIndex][1].length == 0) {
          rowIndex++;
          continue;
      }
      var tenSanPham = data[rowIndex][3];
      var sizeDong = data[rowIndex][6];
      var trangThaiDonHang = data[rowIndex][10];
      if ((trangThaiDonHang == 'đã chuyển hàng' || trangThaiDonHang == 'khách đến mua thanh toán trực tiếp')) {
          var key = tenSanPham + ":" + String(sizeDong)
          filteredData[key] = filteredData[key] == null ? 1 : filteredData[key] + 1;
      }
      rowIndex++;
  }
  return filteredData;
}
/*
function getSaleRevenues()
output: {
  "saleA": {tongSoDonHang: 5, doanhThu: 12000},
  "saleB": {tongSoDonHang: 6, doanhThu: 13000},
  ....
}
*/
function updateSaleRevenues(fileURL) {
  var filteredData = {};
  for (var day = 1; day <= 31; day++) {
    var sheetData = getSheetDataFromFile(fileURL, String(day));
    var rowIndex = 0;
    while (rowIndex < sheetData.length) {
      if (sheetData[rowIndex][1].length == 0) {
        rowIndex++;
        continue;
      }
      var salePhuTrach = sheetData[rowIndex][14];
      var trangThaiDonHang = sheetData[rowIndex][10];
      var price = sheetData[rowIndex][7];
      if(salePhuTrach.trim().length == 0) {
        rowIndex++;
        continue;
      }
      if ((trangThaiDonHang == 'đã chuyển hàng' || trangThaiDonHang == 'khách đến mua thanh toán trực tiếp')) {
        if (filteredData[salePhuTrach] == null) {
          filteredData[salePhuTrach] = {};
        }
        if (filteredData[salePhuTrach].tongSoDonHang == null) {
          filteredData[salePhuTrach].tongSoDonHang = 0;
        }
        if (filteredData[salePhuTrach].doanhThu == null) {
          filteredData[salePhuTrach].doanhThu = 0;
        }
        filteredData[salePhuTrach].tongSoDonHang += 1;
        filteredData[salePhuTrach].doanhThu += Number(price);
      }
      rowIndex++;
    }
  }   
  var sheetIncentive = getSheetFromFile(fileURL, "Incentive");
  Logger.log("keke11")
  for(var rowIndex = 0; rowIndex < Object.keys(filteredData).length; rowIndex++){
      var salePhuTrach = Object.keys(filteredData)[rowIndex];
      var tongSoDonHang = filteredData[salePhuTrach].tongSoDonHang;
      var doanhThu = filteredData[salePhuTrach].doanhThu;

      var cellRowIndex = sheetIncentive.getRange(rowIndex + 2, 1)    
      cellRowIndex.setValues([[String(rowIndex)]])
      cellRowIndex.setBackground("red");
      
      var cellSaleStaff = sheetIncentive.getRange(rowIndex + 2, 2)    
      cellSaleStaff.setValues([[salePhuTrach]])
      cellSaleStaff.setBackground("red");

      var cellQuantity = sheetIncentive.getRange(rowIndex + 2, 3)    
      cellQuantity.setValues([[tongSoDonHang]])
      cellQuantity.setBackground("red");

      var cellSaleStaff = sheetIncentive.getRange(rowIndex + 2, 4)    
      cellSaleStaff.setValues([[doanhThu]])
      cellSaleStaff.setBackground("red");
  }
}
