// テスト用メソッド
function timtreeTest() {
  var resres = timetreePostEvent();
  Logger.log(resres); // ユーザー取得メソッドをコール
  add_row();
}

// カレンダー取得メソッド
function timetreeGetUser() {
  var url = 'https://timetreeapis.com/calendars';
  var method = 'GET';
  var payload = '';
  return timetreeAPI(url, method, payload); // TimeTree APIをコール
}

// イベント作成メソッド
function timetreePostEvent() {
//  Logger.log("kita");
  var targetCalendarId = PropertiesService.getScriptProperties().getProperty('TARGET_CALENDAR_ID_DEV');

  var url = Utilities.formatString('https://timetreeapis.com/calendars/%s/events', targetCalendarId);
  var method = 'POST';
  var payload = {
    'data': {
      'attributes': {
        'category': 'schedule',
        'title': 'てすとおおおおおおいべんとお',
        'all_day': false,
        'start_at': '2019-03-18T09:00:00.000Z',
        'start_timezone': 'UTC',
        'end_at': '2019-03-18T10:00:00.000Z',
        'end_timezone': 'UTC',
        'description': 'blah blah blah',
        'location': 'Tokyo',
        'url': 'https://example.com'
      },
      'relationships': {
        'label': {
          'data': {
            'id': 'uIW4Wt9M8sVD,1',
            'type': 'label'
          }
        }
      }
  }
};
  
  return timetreeAPI(url, method, payload); // TimeTree APIをコール
}




// TimeTree APIをコールするメソッド
function timetreeAPI(url, method, payload) {
  var accessToken = PropertiesService.getScriptProperties().getProperty('timetree_personal_access_token');
  var headers = {
    'Authorization': 'Bearer ' + accessToken
  };
  var options = {
    'method': method,
    'headers': headers,
    'payload': JSON.stringify(payload),
    'contentType': 'application/json',    
    'muteHttpExceptions': true
  };
//  Logger.log(options);

  var response = UrlFetchApp.fetch(url, options);
  return response;
}

function gcal_test() {
  var cal = CalendarApp.getCalendarById(PropertiesService.getScriptProperties().getProperty('google_email_address'));
  var date = new Date();
  var events = cal.getEventsForDay(date);
  Logger.log(events[0].devareEvent());
}

function trigger_calender_updated() {
  var sabun = 0;
}

