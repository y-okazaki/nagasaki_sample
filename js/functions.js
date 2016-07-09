$(function() {
  // spredsheetsのkeyとworkedsheetId
  var myKey = "spredsheetのkey";
  var myWorksheetId = "spredsheetのworkedsheetId";

  // データ取得
  $.ajax({
    type: 'GET',
    url: 'https://spreadsheets.google.com/feeds/cells/' + myKey + '/' + myWorksheetId +'/public/values?alt=json',
    dataType: 'jsonp',
    cache: false,
    success: function(data){ // 通信が成功した時
      var sheetsEntry = data.feed.entry; // 実データ部分を取得
      var arryData = shapeData(sheetsEntry); // JSONデータを連想配列に変換する
      makeTable(arryData);
    },
    error: function(){ // 通信が失敗した時
      alert("取得に失敗しました。");
      console.log('error');
    }
  });
});

// 取得したJSONのデータを連想配列で返す
function shapeData(jsonData) {
  var shapeData = [];
  var tmpArr = [];
  var startRow = eval(jsonData[0].gs$cell.row);

  for(var i = 0; i < jsonData.length; i++) {
    if(jsonData[i].gs$cell.row == startRow) {
      tmpArr.push(jsonData[i].gs$cell.$t);
    } else if(jsonData[i].gs$cell.row == jsonData[i + 1].gs$cell.row) {
      shapeData.push(tmpArr);
      tmpArr = [] // tmpArrを初期化
      startRow = eval(jsonData[i].gs$cell.row); // startRowを更新
      tmpArr.push(jsonData[i].gs$cell.$t);
    }
  }
  // 最後の行のデータをshapDataに入れる
  shapeData.push(tmpArr);

  return shapeData;
}

// 連想配列になったスプレッドシートのデータをテーブルにする
function makeTable(arryData) {
  if(Array.isArray(arryData)) {
    var table = $('<table class="table_data">');
    $("#data").append(table);
    // thead（セルの見出し）の処理
    var th = $('<tr>');
    for(var i = 0; i < arryData[0].length; i++) {
      th.append('<th>' + arryData[0][i] + '</th>');
    }
    table.append($('<thead>').append(th));

    // tbody（セルのデータ）の処理
    var tbody = $('<tbody>');
    for(var i = 1; i < arryData.length; i++) {
      var td = $('<tr>');
      for(var j = 0; j < arryData[i].length; j++) {
        td.append('<td>' + arryData[i][j] + '</td>');
      }
      tbody.append(td);
    }
    table.append(tbody);
  } else {
    alert("データは、配列の形式で渡してください。");
  }

}
