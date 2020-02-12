var scriptProperties = PropertiesService.getScriptProperties();
var nextSyncTokenKey = 'NEXT_SYNC_TOKEN';

// テストメソッド
function calendarUpdatedSample(e) {
    // var el = fetchUpdatedEvents(e);
    Logger.log('kitayo');
}


function fetchUpdatedEvents(e) {
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
        // console.log(summaryEvent);

        if (summaryEvent.status == 'confirmed') {
            // id逆引きで対応するイベントを取ってくる
            var detailEvent = CalendarApp.getEventById(summaryEvent.id);

            // 終日イベントかを判定
            if (false && detailEvent.isAllDayEvent()) {
                //TODO イケてない実装をイケてる実装にする 0:00 - 23:59とかで
                summaryEvent.start.dateTime = summaryEvent.start.date;
                summaryEvent.end.dateTime = summaryEvent.end.date;
            }

            // イベント新規作成と更新を見分ける
            if (false && summaryEvent.status == 'confirmed' && (summaryEvent.created != summaryEvent.updated)) {
                // TODO ミリ秒まで比較してconfirmedが通らないので秒比較くらいに変える
                summaryEvent.status = 'updated';
            }

            // イベントの基礎データをpush
            eventList.push({
                'id': summaryEvent.id,
                'title': summaryEvent.summary,
                'created': summaryEvent.created,
                'updated': summaryEvent.updated,
                'start': summaryEvent.start.dateTime,
                'end': summaryEvent.end.dateTime,
                'status': summaryEvent.status,
                'location': detailEvent.getLocation(),
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