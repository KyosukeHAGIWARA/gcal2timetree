var scriptProperties = PropertiesService.getScriptProperties();
var nextSyncTokenKey = 'NEXT_SYNC_TOKEN';


function fetchUpdatedEvent(e) {
    var calendarId = e.calendarId;

    // 予定取得時にsyncTokenを指定して差分イベントを取得
    var optionalArgs = {
        'syncToken': getNextSyncToken(calendarId)
    };
    var events = Calendar.Events.list(calendarId, optionalArgs);


    var eventList = [];

    // 差分イベントを処理
    for (var i = 0; i < events.items.length; i++) {
        var event = events.items[i];
        // console.log(event);

        // イベント新規作成と更新を見分ける
        if (event.status == 'confirmed' && (event.created != event.updated)) {
            event.status = 'updated';
        }

        // イベントの基礎データをpush
        eventList.push({
            'name': event.summary,
            'id': event.id,
            'created': event.created,
            'updated': event.updated,
            'status': event.status
        });
    }

    // 今回処理したイベントを対象外とするためsyncTokenを更新
    saveNextSyncToken(events.nextSyncToken);

    return eventList;
}


function calendarUpdatedSample(e) {
    Logger.log(fetchUpdatedEvent(e));
    // console.info('calendarUpdatedSample() ------------------------------');
    // console.log('authMode:%s/calendarId:%s/triggerUid:%s', e.authMode, e.calendarId, e.triggerUid);

    // var calendarId = e.calendarId;

    // // 予定取得時にsyncTokenを指定して差分イベントを取得
    // var optionalArgs = {
    //     'syncToken': getNextSyncToken(calendarId)
    // };
    // var events = Calendar.Events.list(calendarId, optionalArgs);
    // console.log('取得した予定数:%s', events.items.length);

    // // 差分イベントを処理（サンプルなのここではログ表示しているだけ）
    // for (var i = 0; i < events.items.length; i++) {
    //     var event = events.items[i];
    //     console.log('event.summary:%s/event.start:%s/event.end:%s/status:%s', event.summary, event.start, event.end, event.status);
    //     console.log(event)
    // }

    // // 今回処理したイベントを対象外とするためsyncTokenを更新
    // saveNextSyncToken(events.nextSyncToken);
}

function getNextSyncToken(calendarId) {
    // ScriptPropetiesから取得
    var nextSyncToken = scriptProperties.getProperty(nextSyncTokenKey);
    if (nextSyncToken) {
        console.log('getNextSyncToken(from property):%s', nextSyncToken);
        return nextSyncToken
    }

    // ScriptPropetiesにない場合は、カレンダーから取得
    var events = Calendar.Events.list(calendarId, {
        'timeMin': (new Date()).toISOString()
    }); // 最後の予定を取らないといけない？みたいなので timeMinを指定
    nextSyncToken = events.nextSyncToken;
    console.log('getNextSyncToken(from calendar):%s', nextSyncToken);
    return nextSyncToken;
}

function saveNextSyncToken(nextSyncToken) {
    console.log('saveNextSyncToken:%s', nextSyncToken);
    scriptProperties.setProperty(nextSyncTokenKey, nextSyncToken);
}