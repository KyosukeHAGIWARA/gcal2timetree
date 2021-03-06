var scriptProperties = PropertiesService.getScriptProperties();
var nextSyncTokenKey = 'NEXT_SYNC_TOKEN';

// テストメソッド
function calendarUpdatedSample(e) {
    // var el = fetchUpdatedEvents(e);
    Logger.log('kitayo');
}

// イベント更新検知で呼ばれ、差分イベント情報をとってくるメソッド
function gcalFetchUpdatedEvents(e) {
    var calendarId = e.calendarId;

    // 予定取得時にsyncTokenを指定して差分イベントを取得
    var optionalArgs = {
        'syncToken': getNextSyncToken(calendarId)
    };
    var diffEventList = Calendar.Events.list(calendarId, optionalArgs);


    var eventList = [];

    // 差分イベントを処理
    for (var i = 0; i < diffEventList.items.length; i++) {
        var summaryEvent = diffEventList.items[i];

        if (summaryEvent.status == 'confirmed') {
            // id逆引きで対応するイベントを取ってくる
            var detailEvent = CalendarApp.getEventById(summaryEvent.id);



            // 終日イベントかを判定
            if (detailEvent.isAllDayEvent()) {
                //TODO イケてない実装をイケてる実装にする 0:00 - 23:59とかで
                summaryEvent.start.dateTime = summaryEvent.start.date + 'T00:00:00';
                summaryEvent.end.dateTime = summaryEvent.start.date + 'T00:00:00';
            }

            // イベント新規作成と更新を見分ける
            if (summaryEvent.created.slice(0, -4) != summaryEvent.updated.slice(0, -4)) {
                // 下4桁のミリ秒部分を削ってtimestamp比較 ずれてたら更新と判断
                summaryEvent.status = 'updated';
            }


            // タイトルないと怒られるので
            if (!summaryEvent.summary) {
                summaryEvent.summary = '名前なしイベント';
            }


            // イベントの基礎データをpush
            eventList.push({
                'id': summaryEvent.id,
                'title': summaryEvent.summary,
                'created': summaryEvent.created,
                'updated': summaryEvent.updated,
                'start': summaryEvent.start.dateTime,
                'end': summaryEvent.end.dateTime,
                'timezone': 'UTC',
                'status': summaryEvent.status,
                'location': detailEvent.getLocation(),
                'description': detailEvent.getDescription(),
                'isAllDay': detailEvent.isAllDayEvent()
            });
        } else {
            // イベント削除時

            var detailEvent = CalendarApp.getEventById(summaryEvent.id);

            // イベントの基礎データをpush
            eventList.push({
                'id': summaryEvent.id,
                'title': detailEvent.getTitle(),
                'created': '',
                'updated': '',
                'start': detailEvent.getStartTime(),
                'end': detailEvent.getEndTime(),
                'status': summaryEvent.status,
                'location': detailEvent.getLocation(),
                'description': detailEvent.getLocation(),
                'description': detailEvent.getDescription(),
                'isAllDay': detailEvent.isAllDayEvent()
            });
        }


    }

    // 今回処理したイベントを対象外とするためsyncTokenを更新
    scriptProperties.setProperty(nextSyncTokenKey, diffEventList.nextSyncToken);

    // console.log(eventList);
    return eventList;
}




function getNextSyncToken(calendarId) {
    // ScriptPropetiesから取得
    var nextSyncToken = scriptProperties.getProperty(nextSyncTokenKey);
    if (nextSyncToken) {
        // console.log('getNextSyncToken(from property):%s', nextSyncToken);
        return nextSyncToken
    }

    // ScriptPropetiesにない場合は、カレンダーから取得
    var events = Calendar.Events.list(calendarId, {
        'timeMin': (new Date()).toISOString()
    }); // 最後の予定を取らないといけない？みたいなので timeMinを指定
    nextSyncToken = events.nextSyncToken;
    // console.log('getNextSyncToken(from calendar):%s', nextSyncToken);
    return nextSyncToken;
}