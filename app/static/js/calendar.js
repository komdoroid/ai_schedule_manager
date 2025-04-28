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
});