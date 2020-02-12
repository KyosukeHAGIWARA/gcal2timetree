// Gカレのイベント変更検知でトリガー引かれる関数
function onCalendarEventUpdate(e) {
    mainProcess(e);
}

function mainProcess(e) {
    var eventList = fetchUpdatedEvents(e);

    for (var i = 0; i < eventList.length; i++) {
        var event = eventList[i];

        if (event.status == 'canceled') {
            // キャンセルなら、対応するイベントをList検索
            // あれば消す
            // なければ 1週間以内かを計算
            //   一週間以内なら、イベントリスト取ってきて、指定時刻に同一のイベントがあれば消す
            //   今日より過去なら何もしない
            //   1週間より先なら手作業で消すようkeepに通知

            var ttEventId = sssqlSearchById(event.id);

            if (ttEventId != []) {
                timeTreeDeleteEventById(ttEventId[0]);
            } else {
                // TODO implement 正常に消せなかったよアラート
            }

        } else if (event.status == 'confirmed') {
            // 新規作成する
            var options = {

            };
            var response = timeTreeCreateEvent(options);

            ssSqlInsertIdRecord(event.id, response.id);

        } else if (event.status == 'updated') {
            //   更新なら 対応するイベントをList検索
            //     あったら 該当するイベントIDで更新
            //     なければ どうにか対処

            var ttEventId = searchIdList(event.id);

            if (ttEventId != []) {
                var options = {

                };
                timeTreeUpdateEventById(ttEventId[0], options);
            } else {
                // TODO implement 正常に更新できなかったよアラート
            }
        } else {
            // 何らかのエラー
            Logger.log('Exception');
        }
    }
}