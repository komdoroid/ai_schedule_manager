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
            document.getElementById('dailyTimetable').style.display = 'block';
            document.getElementById('timetableDate').textContent = info.dateStr;
            
            // 時間帯を生成 (8:00 ~ 22:00)
            const timeSlots = document.getElementById('timeSlots');
            timeSlots.innerHTML = '';
            
            for (let hour = 8; hour <= 22; hour++) {
                const time = `${hour.toString().padStart(2, '0')}:00`;
                
                const slot = document.createElement('div');
                slot.className = 'time-slot';
                slot.dataset.time = time;
                slot.innerHTML = `
                <strong>${time}</strong>
                <span class="float-end text-muted">+ 予定追加</span>
                `;
                
                slot.addEventListener('click', () => {
                // 選択された時間帯をアクティブ表示
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                slot.classList.add('active');
                
                // 予定追加モーダルを表示
                const modal = new bootstrap.Modal(document.getElementById('eventModal'));
                document.getElementById('eventDate').value = info.dateStr;
                document.getElementById('eventTime').value = time;
                modal.show();
                });
                
                timeSlots.appendChild(slot);
            }
            // 3. 選択した日付の既存予定を取得して表示
            fetch(`/api/daily-events?date=${info.dateStr}`)
                .then(res => res.json())
                .then(events => {
                    events.forEach(event => {
                        const slot = document.querySelector(`.time-slot[data-time="${event.time}"]`);
                        if (slot) {
                            // 既存予定をバッジで表示
                            const eventBadge = document.createElement('div');
                            eventBadge.className = 'event-badge bg-primary text-white p-1 mt-1 rounded';
                            eventBadge.textContent = event.title;
                            slot.appendChild(eventBadge);
                        }
                    });
                });
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