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
function getSaleRevenues(fileURL) {
    var filteredData = {};
    for (var day = 1; day <= 31; day++) {
      var dataOfSaleNotes = getSheetDataFromFile(fileURL, String(day));
      var rowIndex = 0;
      while (rowIndex < dataOfSaleNotes.length) {
        if (data[rowIndex][1].length == 0) {
          rowIndex++;
          continue;
        }
        var salePhuTrach = data[rowIndex][6];
        var trangThaiDonHang = data[rowIndex][10];
        var price = data[rowIndex][10];
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
          filteredData[salePhuTrach].doanhThu += price;
        }
        rowIndex++;
      }
    }
    return filteredData;
  }
