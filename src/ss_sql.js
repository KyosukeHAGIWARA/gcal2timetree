var scriptProperties = PropertiesService.getScriptProperties();
var sssql = SpreadSheetsSQL.open(scriptProperties.getProperty('ID_LIST_SS_ID'), scriptProperties.getProperty('ID_LIST_SS_NAME'));

// テストメソッド
function add_row() {
  var g = 'testa';
  var tt = 'testb';

  sssql.insertRows([{
    gcal_event_id: g,
    tt_event_id: tt
  }]);
  Logger.log(sssql.select(['gcal_event_id', 'tt_event_id']).filter('gcal_event_id = testa').result());
  var i = '7861ig484lagaccdvbcsnhkpct';
  Logger.log(sssqlSearchById(i));
}



// 2argsを以てテーブルに登録
function sssqlInsertIdRecord(gcalEventId, ttEventId) {
  sssql.insertRows([{
    gcal_event_id: gcalEventId,
    tt_event_id: ttEventId
  }]);
}

// 2argsを以てテーブルから削除
function sssqlDeleteIdRecord(gcalEventId, ttEventId) {
  sssql.deleteRows(Utilities.formatString('gcal_event_id = %s and tt_event_id = %s', gcalEventId, ttEventId));
}


// gcalのIDをキーにttのIDを検索
function sssqlSearchById(gcalEventId) {
  var response = sssql.select(['tt_event_id', 'gcal_event_id']).filter(Utilities.formatString('gcal_event_id = %s', gcalEventId)).result();

  return response;

}