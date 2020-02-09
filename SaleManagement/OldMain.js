function main() {  
    var sheetFile2 = getSheetFromFile2(
    "https://docs.google.com/spreadsheets/d/1btPTB-yRSscvs00mYQnnFcyeeTJbjgPOovZd0kz0Dj0/edit#gid=1519051753",
    "Xuất");
    var numberOfDays = 31;
    for(var day = 1; day <= numberOfDays; day++) {
      var dataOfFile1 = getDataFromFile1(
        "https://docs.google.com/spreadsheets/d/1iY3AyYppDe6GHJeWww56ILhq8G9iHdDJbmpTs4LJuUY/edit#gid=981403088",
        String(day));
      saveDataFromFile2(dataOfFile1,sheetFile2,day);
    }
  }
  function getDataFromFile1(fileURL, sheetName) {
    const saleNote022020 = SpreadsheetApp.openByUrl(fileURL);
    SpreadsheetApp.setActiveSpreadsheet(saleNote022020);
    var sheet = saleNote022020.getSheetByName(sheetName);
    sheet.activate();
    var data = sheet.getDataRange().getValues();
    return data
  }
  function filterInputData(data) {
    var filteredData = {};
    var rowIndex = 0;
    while(rowIndex < data.length){
      if(data[rowIndex][1].length == 0) {
        rowIndex++;
        continue;
      }
      var tenSanPham = data[rowIndex][3];
      var sizeDong = data[rowIndex][6];
      var trangThaiDonHang = data[rowIndex][10];
      if((trangThaiDonHang == 'đã chuyển hàng' || trangThaiDonHang == 'khách đến mua thanh toán trực tiếp')) {
        var key = tenSanPham +":"+String(sizeDong)
        filteredData[key] = filteredData[key] == null ? 1 : filteredData[key] + 1;
      }
      rowIndex++;
    }
    return filteredData;
  }
  function getSheetFromFile2(fileURL, sheetName){
    const file2 = SpreadsheetApp.openByUrl(fileURL);
    SpreadsheetApp.setActiveSpreadsheet(file2);
    var sheet = file2.getSheetByName(sheetName);
    sheet.activate();
    return sheet;
  }
  function saveDataFromFile2(dataOfFile1, sheet, myDay) {
    var dataOfFile2 = sheet.getDataRange().getValues();  
    var rowIndex = 0;
    var filteredData = filterInputData(dataOfFile1)
    while(rowIndex < dataOfFile2.length){    
      var day = -1;
      for(var columnIndex = 0; columnIndex < dataOfFile2[rowIndex].length; columnIndex++){      
        var tenSanPham = dataOfFile2[rowIndex][0];
        var size = typeof dataOfFile2[1][columnIndex] == 'string' ?  0 : dataOfFile2[1][columnIndex];  
        if(typeof dataOfFile2[0][columnIndex] == 'object') {
          day = dataOfFile2[0][columnIndex].getDate();
        }
       
        if(Object.keys(filteredData).length > 0) {
          var key = tenSanPham +":"+String(size)
          if(filteredData[key] && day == myDay){
            Logger.log({"rowIndex": rowIndex,"columnIndex": columnIndex,value: filteredData[key]});
            var cell = sheet.getRange(rowIndex + 1, columnIndex + 1)
            cell.setValues([[filteredData[key]]])
            cell.setBackground("red");
          }
        }
      }
      rowIndex++;
    }
  }