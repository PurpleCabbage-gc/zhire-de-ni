const DashboardPage = {
    state: {
        view: 'week',
        selectedDay: null,
        statsOpen: false,
        selectedLineSymptom: 0,
        shareStep: 'target',
        shareTarget: '',
        shareContent: [],
        shareTone: ''
    },

    render() {
        this.state.view = 'week';
        this.state.selectedLineSymptom = 0;
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
            </div>
        `;
        this.initCharts();
    },

    switchView(view) {
        this.state.view = view;
        document.getElementById('dashboard-content').innerHTML =
            view === 'week' ? this.renderWeek() : this.renderMonth();
        document.querySelectorAll('.segment-btn').forEach((btn, i) => {
            btn.classList.toggle('active', (i === 0 && view === 'week') || (i === 1 && view === 'month'));
        });
        this.initCharts();
    },

    getRecordsWithFallback() {
        const records = AppData.getAllRecords();
        if (Object.keys(records).length === 0) {
            return MockData.getMockMonthRecords();
        }
        return records;
    },

    renderWeek() {
        const weekData = MockData.generateWeekData();
        const maxScore = 32;
        return `
            <div>
                <div class="week-petals">
                    ${weekData.map((d, i) => {
                        const ratio = Math.min(d.score / maxScore, 1);
                        let color = '#A3C9A8';
                        if (ratio > 0.25) color = '#F5D68A';
                        if (ratio > 0.5) color = '#F4C2A1';
                        if (ratio > 0.75) color = '#e8a07a';
                        return '<div class="petal-item ' + (this.state.selectedDay === i ? 'selected' : '') + '" onclick="DashboardPage.showDayDetail(' + i + ')">' +
                            '<div class="petal-dot petal-shape" style="background: ' + color + '"></div>' +
                            '<span class="petal-label">周' + d.dayName + '</span></div>';
                    }).join('')}
                </div>
                <div class="week-summary"><p>${this.getWeekSummary(weekData)}</p></div>
                ${this.renderStatsDrawer()}
                ${this.renderReportSection()}
            </div>
        `;
    },

    getWeekSummary(weekData) {
        const recordDays = weekData.filter(d => d.record).length;
        const totalScore = weekData.reduce((s, d) => s + d.score, 0);
        if (recordDays === 0) return '这周还没有记录数据，开始记录后就能看到趋势啦。';
        if (totalScore < 8) return '这周整体状态不错，继续保持哦！';
        const worstDay = weekData.reduce((max, d) => d.score > max.score ? d : max, weekData[0]);
        return '这周身体信号比较密集，尤其是周' + worstDay.dayName + '，你辛苦了。';
    },

    showDayDetail(dayIndex) {
        this.state.selectedDay = dayIndex;
        const weekData = MockData.generateWeekData();
        const day = weekData[dayIndex];
        let detailHTML = '';
        if (day.record) {
            const symptoms = day.record.symptoms || {};
            const mood = day.record.mood || '未记录';
            detailHTML = '<div style="margin-top: 16px;"><p style="margin-bottom: 12px;"><strong>心情：</strong>' + mood + '</p>' +
                '<h4 style="font-size: var(--font-caption); font-weight: 600; margin-bottom: 8px;">症状记录</h4>' +
                MockData.symptomQuestions.map(q => {
                    const val = symptoms[q.id];
                    if (val === undefined) return '';
                    const level = MockData.severityLevels[val];
                    return '<div class="detail-symptom-row"><span>' + q.icon + ' ' + q.field + '</span><span class="detail-severity" style="color: ' + level.color + '">' + level.label + '</span></div>';
                }).join('') + '</div>' +
                '<canvas id="dayChart" width="280" height="200" style="margin-top:12px;"></canvas>';
        } else {
            detailHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 24px;">这天还没有记录</p>';
        }
        this.openDrawer('<h3 style="margin-bottom: 16px;">' + day.date.slice(5) + ' 周' + day.dayName + '</h3>' + detailHTML);

        if (day.record && typeof Chart !== 'undefined') {
            setTimeout(() => {
                const canvas = document.getElementById('dayChart');
                if (!canvas) return;
                const symptoms = day.record.symptoms || {};
                const labels = ['潮热','睡眠','情绪','疲劳','疼痛','记忆','性欲','尿频'];
                const vals = [0,0,0,0,0,0,0,0];
                for (let i = 0; i < 8; i++) vals[i] = symptoms[i + 1] || 0;
                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{ data: vals, backgroundColor: ['#E76F51','#7B68EE','#F5D68A','#A3C9A8','#F4C2A1','#6BA3BE','#DDA0DD','#87CEEB'] }]
                    },
                    options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 4, ticks: { stepSize: 1 } } } }
                });
            }, 100);
        }
    },

    openDrawer(contentHTML) {
        this.closeDrawer();
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        overlay.onclick = () => this.closeDrawer();
        const drawer = document.createElement('div');
        drawer.className = 'drawer';
        drawer.innerHTML = '<div class="drawer-handle"></div>' + contentHTML;
        document.body.appendChild(overlay);
        document.body.appendChild(drawer);
        requestAnimationFrame(() => { overlay.classList.add('show'); drawer.classList.add('show'); });
    },

    closeDrawer() {
        document.querySelectorAll('.drawer-overlay, .drawer').forEach(el => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 350);
        });
    },

    renderMonth() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const records = this.getRecordsWithFallback();
        const journals = AppData.getJournals();

        let recordDays = 0, journalDays = 0;
        Object.keys(records).forEach(k => { const d = new Date(k); if (d.getFullYear() === year && d.getMonth() === month) recordDays++; });
        Object.keys(journals).forEach(k => { const d = new Date(k); if (d.getFullYear() === year && d.getMonth() === month) journalDays++; });

        let calHTML = '<div class="month-calendar"><div class="cal-header">';
        ['日','一','二','三','四','五','六'].forEach(d => { calHTML += '<span class="cal-header-cell">' + d + '</span>'; });
        calHTML += '</div><div class="cal-grid">';
        for (let i = 0; i < firstDay; i++) calHTML += '<span class="cal-cell empty"></span>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateKey = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
            const rec = records[dateKey];
            let bgColor = 'transparent';
            let cls = 'cal-cell';
            if (rec) {
                const score = Object.values(rec.symptoms || {}).reduce((a, b) => a + b, 0);
                if (score === 0) bgColor = 'rgba(163,201,168,0.25)';
                else if (score < 8) bgColor = 'rgba(245,214,138,0.35)';
                else if (score < 16) bgColor = 'rgba(244,194,161,0.45)';
                else bgColor = 'rgba(232,160,122,0.5)';
                cls += ' has-data';
            }
            if (d === today.getDate()) cls += ' today';
            calHTML += '<span class="' + cls + '" style="background: ' + bgColor + '">' + d + '</span>';
        }
        calHTML += '</div></div>';

        return `
            <div>
                <h3 style="margin-bottom: 12px; font-weight: 600;">${year}年${month + 1}月</h3>
                ${calHTML}
                ${this.renderStatsDrawer()}
                ${this.renderReportSection()}
            </div>
        `;
    },

    renderStatsDrawer() {
        const records = this.getRecordsWithFallback();
        const journals = AppData.getJournals();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        let recordDays = 0, journalDays = 0;
        Object.keys(records).forEach(k => { const d = new Date(k); if (d.getFullYear() === year && d.getMonth() === month) recordDays++; });
        Object.keys(journals).forEach(k => { const d = new Date(k); if (d.getFullYear() === year && d.getMonth() === month) journalDays++; });

        return `
            <div class="stats-drawer ${this.state.statsOpen ? 'open' : ''}">
                <div class="stats-handle" onclick="DashboardPage.toggleStats()">
                    <span class="stats-handle-bar"></span>
                    <span style="font-size:13px;color:var(--text-muted);">${this.state.statsOpen ? '收起详细数据' : '展开详细数据'}</span>
                </div>
                <div class="stats-body">
                    <h3 class="dashboard-section-title">本月记录活跃度</h3>
                    <div class="stat-row">
                        <div class="stat-card"><div class="stat-label">本月有 ${recordDays} 天记录了身心不适</div><div class="stat-number">${recordDays}</div></div>
                        <div class="stat-card"><div class="stat-label">本月有 ${journalDays} 天我做了勇敢尝试</div><div class="stat-number">${journalDays}</div></div>
                    </div>
                    <canvas id="chartPie" width="300" height="200" style="margin-top:12px;"></canvas>
                    <div class="line-symptom-selector">
                        ${['潮热','睡眠','情绪','疲劳','疼痛','记忆','性欲','尿频'].map((s, i) =>
                            '<button class="line-symptom-chip ' + (this.state.selectedLineSymptom === i ? 'active' : '') + '" data-sym-idx="' + i + '" onclick="DashboardPage.selectLineSymptom(' + i + ')">' + s + '</button>'
                        ).join('')}
                    </div>
                    <canvas id="chartLine" width="600" height="280" style="margin-top:8px;width:100%;"></canvas>
                </div>
            </div>
        `;
    },

    toggleStats() {
        this.state.statsOpen = !this.state.statsOpen;
        const drawer = document.querySelector('.stats-drawer');
        if (drawer) {
            drawer.classList.toggle('open', this.state.statsOpen);
            if (this.state.statsOpen) {
                setTimeout(() => this.initCharts(), 350);
            }
        }
    },

    initCharts() {
        if (typeof Chart === 'undefined') return;

        // Destroy existing charts first
        ['chartPie','chartLine'].forEach(id => {
            const c = Chart.getChart(id);
            if (c) c.destroy();
        });

        const records = this.getRecordsWithFallback();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const labels = ['潮热','睡眠','情绪','疲劳','疼痛','记忆','性欲','尿频'];
        const counts = [0,0,0,0,0,0,0,0];
        const trendData = {};

        Object.entries(records).forEach(([dateKey, rec]) => {
            const d = new Date(dateKey);
            if (d.getFullYear() !== year || d.getMonth() !== month) return;
            const symptoms = rec.symptoms || {};
            for (let i = 0; i < 8; i++) {
                const v = symptoms[i + 1];
                if (v !== undefined && v > 0) {
                    counts[i] += v;
                    if (!trendData[dateKey]) trendData[dateKey] = {};
                    trendData[dateKey][i] = v;
                }
            }
        });

        const pieEl = document.getElementById('chartPie');
        if (pieEl) {
            const hasData = counts.some(c => c > 0);
            new Chart(pieEl, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: hasData ? counts : Array.from({length:8}, () => Math.floor(Math.random()*8+1)),
                        backgroundColor: ['#E76F51','#7B68EE','#F5D68A','#A3C9A8','#F4C2A1','#6BA3BE','#DDA0DD','#87CEEB']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
            });
        }

        // Use buildLineChart so initial chart matches re-select behavior
        this.buildLineChart();
    },

    selectLineSymptom(index) {
        this.state.selectedLineSymptom = index;
        document.querySelectorAll('.line-symptom-chip').forEach(c => {
            c.classList.toggle('active', parseInt(c.dataset.symIdx) === index);
        });
        // Destroy only line chart, then rebuild both (pie is fine but destroy anyway for safety)
        const c = Chart.getChart('chartLine');
        if (c) c.destroy();
        // Rebuild line chart only — don't re-init pie chart
        this.buildLineChart();
    },

    buildLineChart() {
        if (typeof Chart === 'undefined') return;
        const lineEl = document.getElementById('chartLine');
        if (!lineEl) return;
        // Destroy old instance if exists
        const old = Chart.getChart('chartLine');
        if (old) old.destroy();

        const records = this.getRecordsWithFallback();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const labels = ['潮热','睡眠','情绪','疲劳','疼痛','记忆','性欲','尿频'];
        const lineColor = ['#E76F51','#7B68EE','#F5D68A','#A3C9A8','#F4C2A1','#6BA3BE','#DDA0DD','#87CEEB'];
        const si = this.state.selectedLineSymptom || 0;

        const trendData = {};
        Object.entries(records).forEach(([dateKey, rec]) => {
            const d = new Date(dateKey);
            if (d.getFullYear() !== year || d.getMonth() !== month) return;
            const symptoms = rec.symptoms || {};
            const v = symptoms[si + 1];
            if (v !== undefined && v > 0) {
                trendData[dateKey] = v;
            }
        });
        const dates = Object.keys(trendData).sort();

        let lineLabels, lineData;
        if (dates.length === 0) {
            lineLabels = [];
            lineData = [];
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const pastDays = Math.min(daysInMonth, now.getDate());
            for (let d = 1; d <= pastDays; d++) {
                lineLabels.push((month + 1) + '/' + d);
                lineData.push(Math.floor(Math.random() * 4) + 1);
            }
        } else {
            // One datapoint per label
            lineLabels = dates.map(dk => dk.slice(5));
            lineData = dates.map(dk => trendData[dk] !== undefined ? trendData[dk] : 0);
        }

        if (lineLabels.length === 1) {
            lineLabels = [lineLabels[0], ''];
            lineData = [lineData[0], lineData[0]];
        }

        new Chart(lineEl, {
            type: 'line',
            data: {
                labels: lineLabels,
                datasets: [{
                    label: labels[si] + ' 严重程度',
                    data: lineData,
                    borderColor: lineColor[si],
                    backgroundColor: lineColor[si] + '20',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 3,
                    pointBackgroundColor: lineColor[si]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: { ticks: { maxTicksLimit: 15, font: { size: 10 }, autoSkip: true } },
                    y: { min: 0, max: 4, ticks: { stepSize: 1, font: { size: 11 } }, title: { display: true, text: '严重程度', font: { size: 10 } } }
                },
                plugins: { legend: { display: false } }
            }
        });
    },

    renderReportSection() {
        return `
            <div class="report-section">
                <h3>报告与分享</h3>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.showReportPage('week')">生成周度报告</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.showReportPage('month')">生成月度报告</button>
                </div>
            </div>
        `;
    },

    showReportPage(type) {
        const label = type === 'week' ? '周度' : '月度';
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.render()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">${label}报告</span>
                    <span></span>
                </div>
                <p style="font-size: var(--font-caption); color: var(--text-secondary); margin: 12px 0;">报告包含：趋势总结、主要困扰变化、正向事件回顾</p>
                <div style="background: var(--bg-primary); border-radius: var(--radius-sm); padding: 20px; font-size: var(--font-caption); color: var(--text-secondary); line-height: 1.8;">
                    <p style="font-weight:600;color:var(--text-primary);">📊 趋势总结</p>
                    <p style="margin-bottom: 12px;">近期状态有所波动，部分信号值得关注。</p>
                    <p style="font-weight:600;color:var(--text-primary);">✨ 正向事件回顾</p>
                    <p>本${label === '周度' ? '周' : '月'}你坚持记录了身心感受，这是对自己的温柔关注。</p>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px; min-height: 56px; font-size: var(--font-h2);" onclick="DashboardPage.showSharePage()">
                    📤 分享报告
                </button>
            </div>
        `;
    },

    showSharePage() {
        this.state.shareStep = 'target';
        this.state.shareTarget = '';
        this.state.shareContent = [];
        this.state.shareTone = '';
        this.renderShareStep();
    },

    renderShareStep() {
        const container = document.getElementById('page-container');
        switch (this.state.shareStep) {
            case 'target': container.innerHTML = this.renderShareTarget(); break;
            case 'content': container.innerHTML = this.renderShareContent(); break;
            case 'tone': container.innerHTML = this.renderShareTone(); break;
            case 'draft': container.innerHTML = this.renderShareDraft(); break;
        }
    },

    renderShareTarget() {
        const targets = [
            { label: '伴侣', icon: '💑', desc: '致最亲近的人' },
            { label: '子女', icon: '👨‍👩‍👧', desc: '让孩子更懂你' },
            { label: '朋友/姐妹', icon: '👭', desc: '闺蜜间的分享' },
            { label: '医生', icon: '🩺', desc: '就诊时辅助沟通' },
            { label: '其他', icon: '💬', desc: '自定义分享对象' }
        ];
        return `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.render()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">理解分享</span>
                    <span></span>
                </div>
                <div class="share-steps">
                    <span class="share-step active">1</span><span class="share-step-line"></span>
                    <span class="share-step">2</span><span class="share-step-line"></span>
                    <span class="share-step">3</span><span class="share-step-line"></span>
                    <span class="share-step">4</span>
                </div>
                <p style="color:var(--text-secondary);margin: 12px 0;">你想把这份说明发给谁？</p>
                <div class="share-option-list">
                    ${targets.map(t => `
                        <button class="share-target-card ${this.state.shareTarget === t.label ? 'active' : ''}" data-share-value="${t.label}" onclick="DashboardPage.selectTarget('${t.label}')">
                            <span class="share-target-icon">${t.icon}</span>
                            <div>
                                <div style="font-size:var(--font-body);font-weight:600;">${t.label}</div>
                                <div style="font-size:var(--font-caption);color:var(--text-secondary);">${t.desc}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:20px;" ${!this.state.shareTarget ? 'disabled' : ''} onclick="DashboardPage.state.shareStep='content';DashboardPage.renderShareStep()">下一步</button>
            </div>
        `;
    },

    selectTarget(t) {
        this.state.shareTarget = t;
        document.querySelectorAll('.share-target-card').forEach(c => {
            c.classList.toggle('active', c.dataset.shareValue === t);
        });
        const nextBtn = document.querySelector('#page-container .btn-primary');
        if (nextBtn && nextBtn.textContent.includes('下一步')) nextBtn.disabled = false;
    },

    renderShareContent() {
        const chips = ['睡眠变化', '情绪变化', '身体不适', '希望得到的支持', '只分享科普', '就医前症状整理'];
        return `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.state.shareStep='target';DashboardPage.renderShareStep()">← 上一步</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">选择内容</span>
                    <span></span>
                </div>
                <div class="share-steps">
                    <span class="share-step done">✓</span><span class="share-step-line done"></span>
                    <span class="share-step active">2</span><span class="share-step-line"></span>
                    <span class="share-step">3</span><span class="share-step-line"></span>
                    <span class="share-step">4</span>
                </div>
                <p style="color:var(--text-secondary);margin: 12px 0;">你想让对方了解哪些？（可多选）</p>
                <div class="share-chip-group">
                    ${chips.map(c => '<button class="share-chip ' + (this.state.shareContent.includes(c) ? 'active' : '') + '" onclick="DashboardPage.toggleContent(\'' + c + '\', this)">' + c + '</button>').join('')}
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:20px;" ${this.state.shareContent.length === 0 ? 'disabled' : ''} onclick="DashboardPage.state.shareStep='tone';DashboardPage.renderShareStep()">下一步</button>
            </div>
        `;
    },

    toggleContent(c, el) {
        const idx = this.state.shareContent.indexOf(c);
        if (idx >= 0) this.state.shareContent.splice(idx, 1);
        else this.state.shareContent.push(c);
        if (el) el.classList.toggle('active');
        const nextBtn = document.querySelector('#page-container .btn-primary');
        if (nextBtn && nextBtn.textContent.includes('下一步')) {
            nextBtn.disabled = this.state.shareContent.length === 0;
        }
    },

    renderShareTone() {
        const tones = [
            { label: '温和说明', icon: '🌸', desc: '柔软温和，适合初次沟通' },
            { label: '认真沟通', icon: '📝', desc: '正式清晰，适合深入交流' },
            { label: '简短提醒', icon: '💡', desc: '简洁直接，适合日常提醒' },
            { label: '轻松一点', icon: '😊', desc: '轻松幽默，适合亲密关系' }
        ];
        return `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.state.shareStep='content';DashboardPage.renderShareStep()">← 上一步</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">选择语气</span>
                    <span></span>
                </div>
                <div class="share-steps">
                    <span class="share-step done">✓</span><span class="share-step-line done"></span>
                    <span class="share-step done">✓</span><span class="share-step-line done"></span>
                    <span class="share-step active">3</span><span class="share-step-line"></span>
                    <span class="share-step">4</span>
                </div>
                <p style="color:var(--text-secondary);margin: 12px 0;">你希望这段话是什么语气？</p>
                <div class="share-option-list">
                    ${tones.map(t => `
                        <button class="share-target-card ${this.state.shareTone === t.label ? 'active' : ''}" data-share-value="${t.label}" onclick="DashboardPage.selectTone('${t.label}')">
                            <span class="share-target-icon">${t.icon}</span>
                            <div>
                                <div style="font-size:var(--font-body);font-weight:600;">${t.label}</div>
                                <div style="font-size:var(--font-caption);color:var(--text-secondary);">${t.desc}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:20px;" ${!this.state.shareTone ? 'disabled' : ''} onclick="DashboardPage.state.shareStep='draft';DashboardPage.renderShareStep()">生成草稿</button>
            </div>
        `;
    },

    selectTone(t) {
        this.state.shareTone = t;
        document.querySelectorAll('.share-target-card').forEach(c => {
            c.classList.toggle('active', c.dataset.shareValue === t);
        });
        const nextBtn = document.querySelector('#page-container .btn-primary');
        if (nextBtn && nextBtn.textContent.includes('生成草稿')) nextBtn.disabled = false;
    },

    renderShareDraft() {
        const draft = this.generateDraft();
        const colorClass = this.getDraftColorClass();
        return `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.state.shareStep='tone';DashboardPage.renderShareStep()">← 我再改改</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">你的分享说明</span>
                    <span></span>
                </div>
                <div class="share-steps">
                    <span class="share-step done">✓</span><span class="share-step-line done"></span>
                    <span class="share-step done">✓</span><span class="share-step-line done"></span>
                    <span class="share-step done">✓</span><span class="share-step-line done"></span>
                    <span class="share-step active">4</span>
                </div>
                <p style="font-size:14px;color:var(--text-secondary);margin: 12px 0;">根据你的选择生成的草稿，可以修改后再分享。</p>
                <div class="share-draft-box ${colorClass}">
                    <div class="share-draft-label">致 ${this.state.shareTarget}</div>
                    ${draft}
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:16px;">
                    <button class="btn btn-primary" style="flex:1;min-height:56px;" onclick="DashboardPage.copyDraft()">📋 复制文字</button>
                    <button class="btn btn-accent" style="flex:1;min-height:56px;" onclick="DashboardPage.generateShareImage()">🖼️ 生成图片</button>
                </div>
                <div id="share-image-result" style="margin-top:16px;"></div>
                <button class="btn btn-ghost" style="width:100%;margin-top:10px;" onclick="DashboardPage.render()">保存草稿，稍后再看</button>
            </div>
        `;
    },

    generateShareImage() {
        const text = this.generateDraft().replace(/<br>/g, '\n').replace(/<[^>]*>/g, '');
        const wallpapers = [
            'assets/Camera_XHS_1782474634237_1782474717622edit.jpg',
            'assets/Camera_XHS_1782474638231_1782474732339edit.jpg',
            'assets/Camera_XHS_1782474656705_1782474750586edit.jpg',
            'assets/Camera_XHS_1782474664427_1782474768007edit.jpg'
        ];
        const bg = wallpapers[Math.floor(Math.random() * wallpapers.length)];

        const btn = document.querySelector('.btn-accent');
        if (btn) { btn.disabled = true; btn.textContent = '生成中...'; }

        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 1067;
        const ctx = canvas.getContext('2d');

        let done = false;
        const finish = (withWallpaper) => {
            if (done) return;
            done = true;

            if (!withWallpaper) {
                const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                grad.addColorStop(0, '#FDF0E7');
                grad.addColorStop(1, '#F3F0FA');
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#333333';
            ctx.font = 'bold 36px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('炙热的你', canvas.width / 2, 95);

            ctx.strokeStyle = '#A3C9A8';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 60, 120);
            ctx.lineTo(canvas.width / 2 + 60, 120);
            ctx.stroke();

            ctx.fillStyle = '#333333';
            ctx.font = '20px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'left';
            const lines = this.wrapText(ctx, text, canvas.width - 80);
            let y = 165;
            lines.forEach(line => {
                if (y < canvas.height - 160) {
                    ctx.fillText(line, 40, y);
                    y += line === '' ? 16 : 36;
                }
            });

            ctx.fillStyle = '#999999';
            ctx.font = '16px "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('来自「炙热的你」App', canvas.width / 2, canvas.height - 60);

            if (btn) { btn.disabled = false; btn.textContent = '🖼️ 生成图片'; }
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            this.showImagePreview(dataUrl);
        };

        const timeout = setTimeout(() => finish(false), 6000);

        const img = new Image();
        img.onload = () => {
            clearTimeout(timeout);
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const sw = img.width * scale;
            const sh = img.height * scale;
            ctx.drawImage(img, (canvas.width - sw) / 2, (canvas.height - sh) / 2, sw, sh);
            finish(true);
        };
        img.onerror = () => {
            clearTimeout(timeout);
            finish(false);
        };
        img.src = bg;
    },

    wrapText(ctx, text, maxWidth) {
        const lines = [];
        const paragraphs = text.split('\n');
        paragraphs.forEach(para => {
            if (para.trim() === '') { lines.push(''); return; }
            let line = '';
            for (let i = 0; i < para.length; i++) {
                const testLine = line + para[i];
                if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
                    lines.push(line);
                    line = para[i];
                } else {
                    line = testLine;
                }
            }
            if (line) lines.push(line);
        });
        return lines;
    },

    showImagePreview(dataUrl) {
        this.closeImagePreview();
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) DashboardPage.closeImagePreview();
        });
        overlay.innerHTML = `
            <div class="image-preview-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="font-size:20px;margin:0;">图片已生成</h3>
                    <button onclick="DashboardPage.closeImagePreview()" style="font-size:24px;background:none;border:none;cursor:pointer;width:44px;height:44px;padding:0;line-height:44px;color:var(--text-secondary);">✕</button>
                </div>
                <img src="${dataUrl}" style="width:100%;border-radius:12px;display:block;" alt="分享图片" />
                <p style="font-size:14px;color:var(--text-secondary);margin:12px 0;text-align:center;">长按图片或点击下方按钮保存至相册</p>
                <button class="btn btn-primary" style="width:100%;min-height:56px;font-size:18px;" onclick="DashboardPage.downloadImage()">💾 保存图片</button>
            </div>
        `;
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));
    },

    closeImagePreview() {
        const overlay = document.querySelector('.image-preview-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 300);
        }
    },

    downloadImage() {
        const img = document.querySelector('.image-preview-card img');
        if (!img) return;
        const link = document.createElement('a');
        link.download = '炙热的你_分享_' + new Date().toISOString().slice(0, 10) + '.jpg';
        link.href = img.src;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        App.showToast('图片已保存');
    },

    generateDraft() {
        const target = this.state.shareTarget;
        const content = this.state.shareContent;
        const tone = this.state.shareTone;

        // Greeting per target
        const greetings = {
            '伴侣': { '温和说明': '亲爱的，最近我的身体正在经历一些变化，想慢慢跟你说。', '认真沟通': '我想认真地跟你聊聊我最近的身体状况，这对我挺重要的。', '简短提醒': '跟你说一声，最近身体有些小变化。', '轻松一点': '嘿～最近身体在跟我"闹脾气"呢，想跟你念叨念叨。' },
            '子女': { '温和说明': '孩子，妈妈最近身体有些变化，想让你了解一下。', '认真沟通': '我想跟你认真地聊一聊妈妈最近的身体情况。', '简短提醒': '宝贝，妈妈身体最近有点变化，跟你说一下。', '轻松一点': '宝贝～妈妈身体像在"系统升级"，想跟你说说～' },
            '朋友/姐妹': { '温和说明': '姐妹，最近身体在悄悄变化，想跟你分享。', '认真沟通': '作为朋友，我想让你了解我最近的一些身体变化。', '简短提醒': '姐妹，跟你说声，最近身体在经历一些变化。', '轻松一点': '姐妹们～我的身体最近像个"变频空调"！跟你聊聊～' },
            '医生': { '温和说明': '医生您好，以下是我近期整理的身体变化记录，想请您帮忙看看。', '认真沟通': '医生您好，以下是我近期的症状记录摘要，希望您能帮我评估。', '简短提醒': '医生您好，近期关注到一些身体变化，请帮我看看。', '轻松一点': '医生您好～最近有些小状况，想咨询一下您的意见。' },
            '其他': { '温和说明': '你好，想跟你分享一下我最近的身体变化。', '认真沟通': '你好，我想跟你说说我最近的一些身体情况。', '简短提醒': '跟你说一下，最近身体有些变化。', '轻松一点': '嗨～最近身体有些小变化，跟你说说～' }
        };

        // Content template per chip
        const contentTemplates = {
            '睡眠变化': { '温和说明': '最近睡眠不太踏实，有时入睡困难，有时半夜醒了就再难睡着。第二天精神也跟着受影响。', '认真沟通': '睡眠质量有明显变化：入睡时间变长，夜间易醒，整体睡眠深度下降。这可能与激素波动导致的体温调节紊乱有关。', '简短提醒': '最近睡眠不太好，有时会半夜醒来。', '轻松一点': '最近睡觉像开盲盒，有时一觉天亮，有时半夜就"开机"了～' },
            '情绪变化': { '温和说明': '情绪有时会莫名低落或烦躁，不是故意要发脾气，而是身体在调整中。', '认真沟通': '情绪波动较频繁，容易出现焦虑、低落或易怒的状态。这是激素变化影响神经递质的正常反应，不是我变脆弱了。', '简短提醒': '最近情绪不太稳定，有时会莫名烦躁。', '轻松一点': '情绪像在坐过山车，忽高忽低，激素在开派對～' },
            '身体不适': { '温和说明': '身体有时会突然发热出汗，或者关节隐隐酸痛，这些都是更年期常见的信号。', '认真沟通': '出现了潮热、盗汗、关节酸痛等身体症状，这些都是围绝经期雌激素水平下降导致的血管舒缩和骨骼关节反应。', '简短提醒': '身体有些不舒服，比如潮热、关节酸。', '轻松一点': '身体像个"变频空调"——忽冷忽热，关节还时不时刷存在感～' },
            '希望得到的支持': {
                '温和说明': '我需要的不是建议或"别想太多"，而是你的耐心和倾听。在我状态不好的时候，给我一点空间或一个拥抱就好。',
                '认真沟通': '我需要你理解：这些变化不受我主观控制。我不是故意情绪不好，也不是想为难谁。我最需要的支持是——不急着给建议，先听完；不催我"快点好起来"，允许我有自己的节奏。',
                '简短提醒': '我需要的不多：多一点耐心，少一点评价。',
                '轻松一点': '帮我的方式超简单：一杯热茶 + 一句"辛苦了" + 别讲道理 = 满分！'
            },
            '只分享科普': { '温和说明': '更年期是每个女性都会经历的阶段，不是病，也不是"老了"。了解这些知识，能让我们更好地照顾自己。', '认真沟通': '围绝经期是女性从生育期过渡到老年期的正常生理阶段，我国女性平均绝经年龄约49.5岁。常见的潮热、失眠、情绪波动等症状，源于雌激素水平的波动和下降。', '简短提醒': '更年期是正常生理阶段，了解这些知识很重要。', '轻松一点': '更年期就像身体在做"系统大更新"——有点卡顿但最后会变好的！' },
            '就医前症状整理': { '温和说明': '我把近期的症状整理了一下，方便医生了解我的情况。', '认真沟通': '以下是我近期的症状记录摘要，包括主要症状、出现频率和影响程度，供医生评估参考。', '简短提醒': '整理了近期症状，供医生参考。', '轻松一点': '把身体"小报告"整理好了，请医生帮我把把关～' }
        };

        // Closing per target and tone
        const closings = {
            '伴侣': { '温和说明': '谢谢你这段时间的包容。有你的理解，我相信我们会一起度过这个阶段。', '认真沟通': '我选择跟你说这些，是因为你是我最亲近的人。我们一起面对，会比一个人扛着好得多。', '简短提醒': '谢谢你一直在。不是你的问题。', '轻松一点': '爱你～谢谢你愿意听我说这些！' },
            '子女': { '温和说明': '妈妈不需要你做什么特别的事，只要你知道这些变化是正常的，就够了。', '认真沟通': '我告诉你这些，是希望你知道妈妈不是"脾气不好"或"想太多"——这是一个自然的身体转折。你能做的最大支持就是理解和耐心。', '简短提醒': '不用担心，这是正常的。妈妈会照顾好自己。', '轻松一点': '所以如果哪天妈妈看起来怪怪的，帮我倒杯水就好～爱你！' },
            '朋友/姐妹': { '温和说明': '谢谢你愿意听我说这些。这段时间如果有突然取消计划或回复慢，请多包涵。', '认真沟通': '谢谢你的陪伴和倾听。有时候知道有人在理解你，本身就是一种力量。', '简短提醒': '谢谢你！如果哪天突然放鸽子，请原谅我～', '轻松一点': '所以如果哪天我状态不对，给我一杯奶茶和一个拥抱就好～' },
            '医生': { '温和说明': '谢谢您的耐心。希望能帮我评估一下目前的状态，看看是否需要进一步检查。', '认真沟通': '谢谢您的专业意见。请帮我评估目前的状态，是否需要进一步检查或治疗。', '简短提醒': '谢谢医生，请帮我评估一下。', '轻松一点': '谢谢医生！麻烦您帮我看看～' },
            '其他': { '温和说明': '谢谢你的倾听。分享这些需要一点勇气，所以谢谢你愿意认真读完。', '认真沟通': '谢谢你愿意了解。更年期不应该是一个禁忌话题，越多人理解，我们就越不孤单。', '简短提醒': '谢谢你！', '轻松一点': '谢谢你愿意听完～比心！' }
        };

        const toneKey = tone || '温和说明';
        const targetGreet = greetings[target] || greetings['其他'];
        const targetClose = closings[target] || closings['其他'];
        let text = targetGreet[toneKey] || targetGreet['温和说明'];

        if (content.length > 0) {
            text += '\n\n';
            content.forEach((c, idx) => {
                const tpl = contentTemplates[c];
                if (tpl) {
                    if (idx > 0) text += '\n';
                    text += (tpl[toneKey] || tpl['温和说明']) + '\n';
                }
            });
        } else {
            // No content selected — generic body
            text += '\n\n最近身体在经历一些变化，有时候不太舒服。这些都不是我能完全控制的，但我在努力记录和调整。';
        }

        text += '\n' + (targetClose[toneKey] || targetClose['温和说明']);
        return text.replace(/\n/g, '<br>');
    },

    getDraftColorClass() {
        const map = { '伴侣': 'share-draft-partner', '子女': 'share-draft-child', '朋友/姐妹': 'share-draft-friend', '医生': 'share-draft-doctor' };
        return map[this.state.shareTarget] || '';
    },

    copyDraft() {
        const box = document.querySelector('.share-draft-box');
        if (!box) return;
        const text = box.innerText;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => App.showToast('已复制到剪贴板'));
        } else {
            App.showToast('已复制到剪贴板');
        }
    }
};
