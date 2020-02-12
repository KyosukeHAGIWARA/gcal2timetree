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
  Logger.log(sssql.select(['gcal_event_id', 'tt_event_id']).filter('gcal_event_id = testa') result());

}



// 2argsを以てテーブルに登録
function ssSqlInsertIdRecord(gcalEventId, ttEventId) {
  sssql.insertRows([{
    gcal_event_id: gcalEventId,
    tt_event_id: ttEventId
  }]);
}


// gcalのIDをキーにttのIDを検索
function sssqlSearchById(gcalEventId) {
  var response = sssql.select(['tt_event_id']).filter(Utilities.formatString('gcal_event_id = %s', gcalEventId).result())
  if (response != []) {
    return [];
  } else {
    return response[0].tt_event_id
  }
}