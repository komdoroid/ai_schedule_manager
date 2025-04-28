document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // 月表示
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: '/api/schedules', // スケジュールデータのAPIエンドポイント
        dateClick: function(info) {
            // モーダルに日付をセットして表示
            const modal = new bootstrap.Modal(document.getElementById('eventModal'));
            document.getElementById('eventDate').value = info.dateStr;
            modal.show()
        }
    });
    calendar.render();

    // 保存ボタンのイベント
    document.getElementById('saveEvent').addEventListener('click', function() {
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;

        fetch("/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                title: title,
                date: date,
                time: time || null
            })
        })
        .then(response => {
            if (response.ok){
                location.reload(); // ページをリロードしてカレンダー更新
            }
        })
    })

    // AI予定登録フォームの処理
    document.getElementById('aiEventForm').addEventListener('submit', async function(e){
        e.preventDefault();
        const userInput = document.getElementById('aiInput').value;

        // OpenAI APIで自然言語を解析
        const response = await fetch("/ai-parse", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({text: userInput})
        });

        const result = await response.json();

        if(result.error){
            alert("エラー: " + result.error)
        }

        // 解析結果を確認
        if (confirm(`以下の予定を登録しますか？\n\nタイトル: ${result.title}\n日時: ${result.date} ${result.time || ''}`)) {
            // 通常の予定登録APIを呼び出し
            fetch("/add", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: result.title,
                    date: result.date,
                    time: result.time
                })
            }).then(() => {
                alert("登録完了!");
                location.reload();
            })
        }
    })
});