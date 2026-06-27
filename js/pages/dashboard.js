const DashboardPage = {
    state: {
        view: 'week',
        selectedDay: null,
        shareStep: 'target',
        shareTarget: '',
        shareContent: [],
        shareTone: ''
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
                ${this.renderStatModules()}
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
                }).join('') + '</div>';
        } else {
            detailHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 24px;">这天还没有记录</p>';
        }
        this.openDrawer('<h3 style="margin-bottom: 16px;">' + day.date.slice(5) + ' 周' + day.dayName + '</h3>' + detailHTML);
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
        const records = AppData.getAllRecords();
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
                <div class="stat-row">
                    <div class="stat-card"><div class="stat-label">本月有 ${recordDays} 天记录了身心不适</div><div class="stat-number">${recordDays}</div></div>
                    <div class="stat-card"><div class="stat-label">本月有 ${journalDays} 天我做了勇敢尝试</div><div class="stat-number">${journalDays}</div></div>
                </div>
                <canvas id="chartPie" width="300" height="200" style="margin-top:16px;"></canvas>
                <canvas id="chartLine" width="300" height="180" style="margin-top:16px;"></canvas>
                ${this.renderReportSection()}
            </div>
        `;
    },

    renderStatModules() {
        const records = AppData.getAllRecords();
        const journals = AppData.getJournals();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        let recordDays = 0, journalDays = 0;
        Object.keys(records).forEach(k => { const d = new Date(k); if (d.getFullYear() === year && d.getMonth() === month) recordDays++; });
        Object.keys(journals).forEach(k => { const d = new Date(k); if (d.getFullYear() === year && d.getMonth() === month) journalDays++; });

        return `
            <h3 class="dashboard-section-title">本月记录活跃度</h3>
            <div class="stat-row">
                <div class="stat-card"><div class="stat-label">本月有 ${recordDays} 天记录了身心不适</div><div class="stat-number">${recordDays}</div></div>
                <div class="stat-card"><div class="stat-label">本月有 ${journalDays} 天我做了勇敢尝试</div><div class="stat-number">${journalDays}</div></div>
            </div>
            <canvas id="chartPie" width="300" height="200" style="margin-top:16px;"></canvas>
            <canvas id="chartLine" width="300" height="180" style="margin-top:16px;"></canvas>
        `;
    },

    initCharts() {
        if (typeof Chart === 'undefined') return;
        const records = AppData.getAllRecords();
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
        if (pieEl && counts.some(c => c > 0)) {
            new Chart(pieEl, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{ data: counts, backgroundColor: ['#E76F51','#7B68EE','#F5D68A','#A3C9A8','#F4C2A1','#6BA3BE','#DDA0DD','#87CEEB'] }]
                },
                options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } } }
            });
        }

        const lineEl = document.getElementById('chartLine');
        const dates = Object.keys(trendData).sort();
        if (lineEl && dates.length > 0) {
            const topSymptom = counts.indexOf(Math.max(...counts));
            const lineData = dates.map(dk => trendData[dk][topSymptom] || 0);
            new Chart(lineEl, {
                type: 'line',
                data: {
                    labels: dates.map(dk => dk.slice(5)),
                    datasets: [{ label: labels[topSymptom] + ' 严重程度', data: lineData, borderColor: '#E76F51', backgroundColor: 'rgba(231,111,81,0.1)', fill: true, tension: 0.3 }]
                },
                options: { responsive: true, maintainAspectRatio: true, scales: { y: { min: 0, max: 4, ticks: { stepSize: 1 } } }, plugins: { legend: { display: true, position: 'bottom' } } }
            });
        }
    },

    renderReportSection() {
        return `
            <div class="report-section">
                <h3>报告与分享</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.showReportPage('week')">生成周度报告</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.showReportPage('month')">生成月度报告</button>
                </div>
                <button class="btn btn-primary" style="width:100%;" onclick="DashboardPage.showSharePage()">分享给亲友</button>
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
                    <button class="btn btn-ghost" style="font-size:13px;padding:4px 10px;" onclick="DashboardPage.showSharePage()">一键分享</button>
                </div>
                <p style="font-size: var(--font-caption); color: var(--text-secondary); margin: 12px 0;">报告包含：趋势总结、主要困扰变化、正向事件回顾</p>
                <div style="background: var(--bg-primary); border-radius: var(--radius-sm); padding: 20px; font-size: var(--font-caption); color: var(--text-secondary); line-height: 1.8;">
                    <p style="font-weight:600;color:var(--text-primary);">📊 趋势总结</p>
                    <p style="margin-bottom: 12px;">近期状态有所波动，部分信号值得关注。</p>
                    <p style="font-weight:600;color:var(--text-primary);">✨ 正向事件回顾</p>
                    <p>本${label === '周度' ? '周' : '月'}你坚持记录了身心感受，这是对自己的温柔关注。</p>
                </div>
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" style="flex:1" onclick="DashboardPage.showSharePage()">分享报告</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.render()">返回看板</button>
                </div>
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
        const targets = ['伴侣', '子女', '朋友/姐妹', '医生', '其他'];
        return `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.render()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">理解分享</span>
                    <span></span>
                </div>
                <p style="color:var(--text-secondary);margin: 12px 0;">你想把这份说明发给谁？</p>
                <div class="share-option-list">
                    ${targets.map(t => '<button class="share-option-item ' + (this.state.shareTarget === t ? 'active' : '') + '" onclick="DashboardPage.selectTarget(\'' + t + '\')">' + t + '</button>').join('')}
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:20px;" ${!this.state.shareTarget ? 'disabled' : ''} onclick="DashboardPage.state.shareStep='content';DashboardPage.renderShareStep()">下一步</button>
            </div>
        `;
    },

    selectTarget(t) {
        this.state.shareTarget = t;
        this.renderShareStep();
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
                <p style="color:var(--text-secondary);margin: 12px 0;">你想让对方了解哪些？（可多选）</p>
                <div class="share-chip-group">
                    ${chips.map(c => '<button class="share-chip ' + (this.state.shareContent.includes(c) ? 'active' : '') + '" onclick="DashboardPage.toggleContent(\'' + c + '\')">' + c + '</button>').join('')}
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:20px;" ${this.state.shareContent.length === 0 ? 'disabled' : ''} onclick="DashboardPage.state.shareStep='tone';DashboardPage.renderShareStep()">下一步</button>
            </div>
        `;
    },

    toggleContent(c) {
        const idx = this.state.shareContent.indexOf(c);
        if (idx >= 0) this.state.shareContent.splice(idx, 1);
        else this.state.shareContent.push(c);
        this.renderShareStep();
    },

    renderShareTone() {
        const tones = ['温和说明', '认真沟通', '简短提醒', '轻松一点'];
        return `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.state.shareStep='content';DashboardPage.renderShareStep()">← 上一步</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">选择语气</span>
                    <span></span>
                </div>
                <p style="color:var(--text-secondary);margin: 12px 0;">你希望这段话是什么语气？</p>
                <div class="share-option-list">
                    ${tones.map(t => '<button class="share-option-item ' + (this.state.shareTone === t ? 'active' : '') + '" onclick="DashboardPage.selectTone(\'' + t + '\')">' + t + '</button>').join('')}
                </div>
                <button class="btn btn-primary" style="width:100%;margin-top:20px;" ${!this.state.shareTone ? 'disabled' : ''} onclick="DashboardPage.state.shareStep='draft';DashboardPage.renderShareStep()">生成草稿</button>
            </div>
        `;
    },

    selectTone(t) {
        this.state.shareTone = t;
        this.renderShareStep();
    },

    renderShareDraft() {
        const draft = this.generateDraft();
        return `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="DashboardPage.state.shareStep='tone';DashboardPage.renderShareStep()">← 我再改改</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">你的分享说明</span>
                    <span></span>
                </div>
                <p style="font-size:14px;color:var(--text-secondary);margin: 12px 0;">根据你的选择生成的草稿，可以修改后再分享。</p>
                <div class="share-draft-box">${draft}</div>
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;">
                    <button class="btn btn-primary" style="flex:1" onclick="DashboardPage.copyDraft()">📋 复制文字</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="App.showToast('图片生成功能开发中')">🖼️ 生成图片</button>
                </div>
                <button class="btn btn-ghost" style="width:100%;margin-top:10px;" onclick="DashboardPage.render()">保存草稿，稍后再看</button>
            </div>
        `;
    },

    generateDraft() {
        const target = this.state.shareTarget;
        const content = this.state.shareContent;
        const tone = this.state.shareTone;
        if (typeof shareTemplates !== 'undefined') {
            const toneKey = { '温和说明': 'gentle', '认真沟通': 'serious', '简短提醒': 'brief', '轻松一点': 'casual' }[tone] || 'gentle';
            const targetKey = { '伴侣': 'partner', '子女': 'child', '朋友/姐妹': 'friend', '医生': 'doctor' }[target] || 'partner';
            const fn = shareTemplates[targetKey] && shareTemplates[targetKey][toneKey];
            if (fn) return fn(content);
        }
        let text = '';
        if (target === '伴侣') text = '亲爱的，最近我的身体有些变化，想跟你聊聊。';
        else if (target === '子女') text = '孩子，妈妈最近身体有些变化，想让你了解一下。';
        else if (target === '朋友/姐妹') text = '姐妹，最近身体在悄悄变化，想跟你分享～';
        else if (target === '医生') text = '医生您好，以下是我近期关注的身体变化。';
        else text = '你好，想跟你分享一下我最近的身体变化。';
        if (content.length > 0) text += '\n\n主要想聊聊：' + content.join('、') + '。';
        text += '\n\n这些都是更年期阶段正常的身体信号，有你的理解和支持，我会更好的。';
        return text.replace(/\n/g, '<br>');
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

