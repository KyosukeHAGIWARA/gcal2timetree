// Gカレのイベント変更検知でトリガー引かれる関数
function onCalendarEventUpdate(e) {
    mainProcess(e);
    // Logger.log('kitayo');
}

function mainProcess(e) {
    var eventList = gcalFetchUpdatedEvents(e);

    for (var i = 0; i < eventList.length; i++) {
        var event = eventList[i];

        if (event.status == 'cancelled') {
            // キャンセルなら、対応するイベントをList検索
            // あれば消す
            // なければ 1週間以内かを計算
            //   一週間以内なら、イベントリスト取ってきて、指定時刻に同一のイベントがあれば消す
            //   今日より過去なら何もしない
            //   1週間より先なら手作業で消すようkeepに通知

            var ttEventId = sssqlSearchById(event.id);

            if (ttEventId != []) {
                timeTreeDeleteEventById(ttEventId[0].tt_event_id);

                sssqlDeleteIdRecord(ttEventId[0].tt_event_id, null);
            } else {
                // TODO implement 正常に消せなかったよアラート
            }

        } else if (event.status == 'confirmed') {
            // 新規作成する

            var response = JSON.parse(timeTreeCreateEvent(event));
            Logger.log(response);

            // TODO tt新規作成失敗した時の処理？

            // テーブルにID対応を追加
            sssqlInsertIdRecord(event.id, response.data.id);

        } else if (event.status == 'updated') {
            //   更新なら 対応するイベントをList検索
            //     あったら 該当するイベントIDで更新
            //     なければ どうにか対処

            var ttEventId = sssqlSearchById(event.id);

            if (ttEventId != []) {
                timeTreeUpdateEventById(ttEventId[0].tt_event_id, event);
            } else {
                // TODO implement 正常に更新できなかったよアラート
            }
        } else {
            // 何らかのエラー
            Logger.log('Exception');
        }
    }
}