// Gカレのイベント変更検知でトリガー引かれる関数
function onCalendarEventUpdate(e) {
    mainProcess(e);
}

function mainProcess(e) {
    var eventList = fetchUpdatedEvent(e);

    if (eventUpdateStatus == 'canceled') {
        // キャンセルなら、対応するイベントをList検索
        // あれば消す
        // なければ 1週間以内かを計算
        //   一週間以内なら、イベントリスト取ってきて、指定時刻に同一のイベントがあれば消す
        //   今日より過去なら何もしない
        //   1週間より先なら手作業で消すようkeepに通知

    } else if (eventUpdateStatus == 'confirm') {
        // 更新か新規作成かを計算(createdとupdateのdiffをとる)
        //   新規作成なら 新規作成する
        //   更新なら 対応するイベントをList検索
        //     あったら 該当するイベントIDで更新
        //     なければ どうにか対処

    } else {
        Logger.log('Exception');
    }
}