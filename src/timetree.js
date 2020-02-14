var scriptProperties = PropertiesService.getScriptProperties();
var targetCalendarId = scriptProperties.getProperty('TARGET_CALENDAR_ID_DEV');


// イベント作成メソッド
function timeTreeCreateEvent(eventOptions) {

  var url = Utilities.formatString('https://timetreeapis.com/calendars/%s/events', targetCalendarId);
  var method = 'POST';
  var payload = {
    'data': {
      'attributes': {
        'category': 'schedule',
        'title': eventOptions.title,
        'all_day': eventOptions.isAllDay,
        'start_at': eventOptions.start,
        'start_timezone': eventOptions.timezone,
        'end_at': eventOptions.end,
        'end_timezone': eventOptions.timezone,
        'description': eventOptions.description,
        'location': eventOptions.location,
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

// イベント更新メソッド
function timeTreeUpdateEventById(eventId, eventOptions) {
  var url = Utilities.formatString('https://timetreeapis.com/calendars/%s/events/%s', targetCalendarId, eventId);
  var method = 'PUT';
  var payload = {
    'data': {
      'attributes': {
        'category': 'schedule',
        'title': eventOptions.title,
        'all_day': eventOptions.isAllDay,
        'start_at': eventOptions.start,
        'start_timezone': 'UTC',
        'end_at': eventOptions.end,
        'end_timezone': 'UTC',
        'description': eventOptions.description,
        'location': eventOptions.location,
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

// イベント削除メソッド
function timeTreeDeleteEventById(eventId) {
  var url = Utilities.formatString('https://timetreeapis.com/calendars/%s/events/%s', targetCalendarId, eventId);
  var method = 'DELETE';
  var payload = '';
  return timetreeAPI(url, method, payload); // TimeTree APIをコール
}



// TimeTree APIをコールするメソッド
function timetreeAPI(url, method, payload) {
  var accessToken = scriptProperties.getProperty('timetree_personal_access_token');
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
  return UrlFetchApp.fetch(url, options);
}




// テスト用メソッド
function timtreeTest() {
  // var eventOptions =
  //   var resres = timeTreeCreateEvent(eventOptions);
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

// テストイベント作成メソッド
function timetreePostEventTest() {

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