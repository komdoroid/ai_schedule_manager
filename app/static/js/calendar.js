document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        events: '/api/schedules',
        contentHeight: 'auto', // カレンダー高さを調整
        dateClick: function(info) {
            // 1. タイムテーブルを表示
            const timetable = document.getElementById('dailyTimetable');
            timetable.style.display = 'block';
            document.getElementById('timetableDate').textContent = info.dateStr;

            // 2. 時間スロットを生成 (6:00 ~ 22:00)
            const timeSlots = document.getElementById('timeSlots');
            timeSlots.innerHTML = '';

            // 3. 既存予定を事前取得
            fetch(`/api/daily-events?date=${info.dateStr}`)
                .then(res => res.json())
                .then(events => {
                    const eventMap = {};
                    events.forEach(event => {
                        eventMap[event.time] = event.title;
                    });

                    // 4. 時間帯をループ生成
                    for (let hour = 6; hour <= 22; hour++) {
                        const time = `${hour.toString().padStart(2, '0')}:00`;
                        
                        const slot = document.createElement('div');
                        slot.className = 'time-slot';
                        slot.dataset.time = time;
                        slot.innerHTML = `
                            <div class="d-flex justify-content-between align-items-center">
                                <strong>${time}</strong>
                                <span class="badge bg-light text-dark">
                                    <i class="bi bi-plus-circle"></i> 追加
                                </span>
                            </div>
                        `;

                        // 5. 既存予定がある場合の表示
                        if (eventMap[time]) {
                            slot.innerHTML += `
                                <div class="event-badge mt-2">
                                    <i class="bi bi-calendar-event"></i> ${eventMap[time]}
                                </div>
                            `;
                        }

                        // 6. クリックイベント
                        slot.addEventListener('click', () => {
                            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
                            slot.classList.add('active');
                            
                            const modal = new bootstrap.Modal(document.getElementById('eventModal'));
                            document.getElementById('eventDate').value = info.dateStr;
                            document.getElementById('eventTime').value = time;
                            modal.show();
                        });

                        timeSlots.appendChild(slot);
                    }
                });
        },
        eventDidMount: function(arg) {
            // 予定要素にクラス追加
            arg.el.classList.add('interactive-event');
        },

        viewDidMount: function(view) {
            // 表示モードに応じてAIフォームを切り替え
            const isWeekView = view.type === 'timeGridWeek';
            document.getElementById('ai-form-week').classList.toggle('d-none', !isWeekView);
            document.getElementById('ai-form-normal').classList.toggle('d-none', isWeekView);

            // カレンダー高さを調整
            calendar.setOption('height', isWeekView ? '70vh' : '80vh');
            
            // 週表示時にメインコンテンツの高さを調整
            if (isWeekView) {
                document.getElementById('main-content').style.minHeight = '70vh';
            } else {
                document.getElementById('main-content').style.minHeight = '';
            }
        }
    });
    calendar.render();

    // 予定保存処理（既存のまま）
    document.getElementById('saveEvent').addEventListener('click', function() {
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const time = document.getElementById('eventTime').value;

        fetch("/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, date, time })
        }).then(() => location.reload());
    });

    document.getElementById('closeTimetable').addEventListener('click', function() {
        document.getElementById('dailyTimetable').style.display = 'none';
    });
});