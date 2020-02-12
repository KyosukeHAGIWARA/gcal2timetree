function add_row() {
  var g = 'testa';
  var tt = 'testb';
  
  var id = PropertiesService.getScriptProperties().getProperty('ID_LIST_SS_ID');
  var name = PropertiesService.getScriptProperties().getProperty('ID_LIST_SS_NAME');
  
  var sssql = SpreadSheetsSQL.open(id, name);

  sssql.insertRows([
  {gcal_event_id: g, tt_event_id: tt}
  ]);
  Logger.log(sssql.select(['gcal_event_id', 'tt_event_id']).result());

}
