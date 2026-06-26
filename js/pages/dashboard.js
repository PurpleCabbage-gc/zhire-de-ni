const DashboardPage = {
    state: {
        view: 'week'
    },

    render() {
        this.state.view = 'week';
        this.renderMain();
    },

    renderMain() {
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page">
                <h1 class="section-title">状态看板</h1>
                <div class="segment-control">
                    <button class="segment-btn ${this.state.view === 'week' ? 'active' : ''}" onclick="DashboardPage.switchView('week')">周视图</button>
                    <button class="segment-btn ${this.state.view === 'month' ? 'active' : ''}" onclick="DashboardPage.switchView('month')">月视图</button>
                </div>
                <div id="dashboard-content">
                    ${this.state.view === 'week' ? this.renderWeek() : this.renderMonth()}
                </div>
                <div class="report-section">
                    <h3 style="margin-bottom: 12px;">报告与分享</h3>
                    <div style="display: flex; gap: 12px;">
                        <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.generateReport('week')">生成周度报告</button>
                        <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.generateReport('month')">生成月度报告</button>
                    </div>
                </div>
            </div>
        `;
    },

    switchView(view) {
        this.state.view = view;
        document.getElementById('dashboard-content').innerHTML =
            view === 'week' ? this.renderWeek() : this.renderMonth();
        document.querySelectorAll('.segment-btn').forEach((btn, i) => {
            btn.classList.toggle('active', (i === 0 && view === 'week') || (i === 1 && view === 'month'));
        });
    },

    renderWeek() {
        const weekData = MockData.generateWeekData();
        const maxScore = 32;

        return `
            <div class="week-view" style="animation: fadeIn 0.3s ease">
                <div class="week-dots">
                    ${weekData.map((d, i) => {
                        const ratio = d.score / maxScore;
                        let color = '#A3C9A8';
                        if (ratio > 0.3) color = '#f0d9a0';
                        if (ratio > 0.6) color = '#F4C2A1';
                        return `
                            <div class="week-dot-item" onclick="DashboardPage.showDayDetail(${i})">
                                <div class="week-dot" style="background: ${color}"></div>
                                <span class="week-dot-label">周${d.dayName}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="week-summary">
                    <p>${this.getWeekSummary(weekData)}</p>
                </div>
            </div>
        `;
    },

    getWeekSummary(weekData) {
        const totalScore = weekData.reduce((s, d) => s + d.score, 0);
        const recordDays = weekData.filter(d => d.record).length;
        if (recordDays === 0) {
            return '这周还没有记录数据，开始记录后就能看到趋势啦。';
        }
        if (totalScore < 10) {
            return '这周整体状态不错，继续保持哦！';
        }
        const worstDay = weekData.reduce((max, d) => d.score > max.score ? d : max, weekData[0]);
        return `这周身体信号比较密集，尤其是周${worstDay.dayName}，你辛苦了。`;
    },

    showDayDetail(dayIndex) {
        const weekData = MockData.generateWeekData();
        const day = weekData[dayIndex];

        let detailContent = '';
        if (day.record) {
            const symptoms = day.record.symptoms || {};
            detailContent = `
                <div class="day-detail-content">
                    <h4>症状记录</h4>
                    <div class="detail-symptoms">
                        ${MockData.symptomQuestions.map(q => {
                            const val = symptoms[q.id];
                            if (val === undefined) return '';
                            const level = MockData.severityLevels[val];
                            return `<div class="detail-symptom-row">
                                <span>${q.icon} ${q.text}</span>
                                <span class="detail-severity" style="color: ${level.color}">${level.label}</span>
                            </div>`;
                        }).join('')}
                    </div>
                    ${day.record.mood ? `<p style="margin-top: 12px;">心情：${day.record.mood}</p>` : ''}
                </div>
            `;
        } else {
            detailContent = `<p style="text-align: center; color: var(--text-secondary); padding: 24px;">这天没有记录</p>`;
        }

        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        overlay.onclick = () => this.closeDrawer();

        const drawer = document.createElement('div');
        drawer.className = 'drawer';
        drawer.innerHTML = `
            <div class="drawer-handle"></div>
            <h3 style="margin-bottom: 16px;">${day.date.slice(5)} 周${day.dayName}</h3>
            ${detailContent}
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(drawer);

        requestAnimationFrame(() => {
            overlay.classList.add('show');
            drawer.classList.add('show');
        });
    },

    closeDrawer() {
        const overlay = document.querySelector('.drawer-overlay');
        const drawer = document.querySelector('.drawer');
        if (overlay) { overlay.classList.remove('show'); setTimeout(() => overlay.remove(), 300); }
        if (drawer) { drawer.classList.remove('show'); setTimeout(() => drawer.remove(), 350); }
    },

    renderMonth() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const records = AppData.getAllRecords();
        const journals = AppData.getJournals();

        let journalCount = 0;
        Object.keys(journals).forEach(key => {
            if (key.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) journalCount++;
        });

        let calendarHTML = '<div class="month-calendar">';
        calendarHTML += '<div class="cal-header">';
        ['日', '一', '二', '三', '四', '五', '六'].forEach(d => {
            calendarHTML += `<span class="cal-header-cell">${d}</span>`;
        });
        calendarHTML += '</div><div class="cal-grid">';

        for (let i = 0; i < firstDay; i++) {
            calendarHTML += '<span class="cal-cell empty"></span>';
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const rec = records[dateKey];
            let cellClass = 'cal-cell';
            let bgColor = 'transparent';

            if (rec) {
                const score = Object.values(rec.symptoms || {}).reduce((a, b) => a + b, 0);
                if (score === 0) bgColor = '#d4edda';
                else if (score < 10) bgColor = '#fff3cd';
                else bgColor = '#fde2d4';
                cellClass += ' has-data';
            }

            const isToday = d === today.getDate();
            if (isToday) cellClass += ' today';

            calendarHTML += `<span class="${cellClass}" style="background: ${bgColor}">${d}</span>`;
        }

        calendarHTML += '</div></div>';

        return `
            <div class="month-view" style="animation: fadeIn 0.3s ease">
                <h3 style="margin-bottom: 12px;">${year}年${month + 1}月</h3>
                ${calendarHTML}
                <div class="achievement-card">
                    <span class="achievement-icon">⭐</span>
                    <span>本月你记录了 <strong>${journalCount}</strong> 次对自己的温柔</span>
                </div>
            </div>
        `;
    },

    generateReport(type) {
        const label = type === 'week' ? '周度' : '月度';
        App.showToast(`${label}报告生成功能开发中`);
    }
};
