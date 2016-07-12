$(function() {
  // spredsheetsのkeyとworkedsheetId
  var myKey = "1K7tmPVZF5FHzT-hx8W_lW694Sn1RMoHcv8nsNlqyTzI";
  var myWorksheetId = "ocrrbi0";

  // データ取得
  $.ajax({
    type: 'GET',
    url: 'https://spreadsheets.google.com/feeds/cells/' + myKey + '/' + myWorksheetId +'/public/values?alt=json',
    dataType: 'jsonp',
    cache: false,
    success: function(data){ // 通信が成功した時
      var sheetsEntry = data.feed.entry; // 実データ部分を取得
      var arryData = getDataSetArray(sheetsEntry); // JSONデータを連想配列に変換する
      drawChart("myChart", arryData);
      // createTableFromArray(arryData);
    },
    error: function(){ // 通信が失敗した時
      alert("取得に失敗しました。");
      console.log('error');
    }
  });
});

// 取得したJSONのデータのセルのデータのみを配列で返す
function getJsonArray(jsonData) {
  var rowData = [];
  var tmpArr = [];
  var startRow = eval(jsonData[0].gs$cell.row);

  for(var i = 0; i < jsonData.length; i++) {
    if(jsonData[i].gs$cell.row == startRow) {
      tmpArr.push(jsonData[i].gs$cell.$t);
    } else if(jsonData[i].gs$cell.row == jsonData[i + 1].gs$cell.row) {
      rowData.push(tmpArr);
      tmpArr = [] // tmpArrを初期化
      startRow = eval(jsonData[i].gs$cell.row); // startRowを更新
      tmpArr.push(jsonData[i].gs$cell.$t);
    }
  }
  // 最後の行のデータをshapDataに入れる
  rowData.push(tmpArr);

  return rowData;
}

// 取得したJSONの行のラベルと値を連想配列に入れて返す
function getAssociativeArray(jsonData) {
  var rowData = []; // 行の中からcolとセルのデータ情報を保存しておく
  var labelArray = []; // ラベルのデータのみを入れる配列
  var dataArray = []; // セルのデータのみを入れる配列
  var rowArr = []; // 行のデータを保存しておく

  // 全体のデータを見てrowDataにデータを入れる
  for(var i = 0; i < jsonData.length; i++) {
    var col = jsonData[i].gs$cell.col;
    var data = jsonData[i].gs$cell.$t;
    rowData.push([]); // 追加する連想配列を入れる配列を作る
    rowData[i] = {"col":col, "data":data};
  }

  for(var i = 0; i < rowData.length; i++) {
    if(rowData[i].col == 1) {
      labelArray.push(rowData[i].data);
    } else if(rowData[i].col == 2) {
      dataArray.push(rowData[i].data);
    }
  }

  var returnArray = [];
  for (var i = 1; i < labelArray.length; i++) {
    var tmpArray = {"label":labelArray[i], "data":dataArray[i]}
    returnArray.push(tmpArray);
  }

  return returnArray;
}


// 取得したJSONの行のラベルの配列と値の配列を連想配列に入れて返す
function getDataSetArray(jsonData) {
  var rowData = []; // 行の中からcolとセルのデータ情報を保存しておく
  var labelArray = []; // ラベルのデータのみを入れる配列
  var dataArray = []; // セルのデータのみを入れる配列
  var rowArr = []; // 行のデータを保存しておく

  // 全体のデータを見てrowDataにデータを入れる
  for(var i = 0; i < jsonData.length; i++) {
    var col = jsonData[i].gs$cell.col;
    var data = jsonData[i].gs$cell.$t;
    rowData.push([]); // 追加する連想配列を入れる配列を作る
    rowData[i] = {"col":col, "data":data};
  }

  for(var i = 0; i < rowData.length; i++) {
    if(rowData[i].col == 1) {
      labelArray.push(rowData[i].data);
    } else if(rowData[i].col == 2) {
      dataArray.push(rowData[i].data);
    }
  }

  var returnArray = {"labels": labelArray,"datas": dataArray};
  return returnArray;
}

function drawChart(canvasId, data) {
  var ctx = $('#' + canvasId);
  var labelArray = data.labels;
  labelArray.shift();
  var dataArray = data.datas;
  dataArray.shift();
  var bgColorArray = [];
  var bdColorArray = [];
  for(var i = 0; i < dataArray.length; i++) {
    bgColorArray.push('rgba(255, 99, 132, 0.2)');
    bdColorArray.push('rgba(255,99,132,1)');
  }
 
  var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labelArray,
          datasets: [{
              label: '# of Votes',
              data: dataArray,
              backgroundColor: bgColorArray,
              borderColor: bdColorArray,
              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:true
                  }
              }]
          }
      }
  });
}

