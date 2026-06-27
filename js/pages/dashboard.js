const DashboardPage = {
    state: {
        view: 'week',
        selectedDay: null,
        shareAudience: 'partner'
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
    },

    switchView(view) {
        this.state.view = view;
        document.getElementById('dashboard-content').innerHTML =
            view === 'week' ? this.renderWeek() : this.renderMonth();
        document.querySelectorAll('.segment-btn').forEach((btn, i) => {
            btn.classList.toggle('active', (i === 0 && view === 'week') || (i === 1 && view === 'month'));
        });
    },

    /* ======= WEEK VIEW ======= */
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
                        return `
                            <div class="petal-item ${this.state.selectedDay === i ? 'selected' : ''}" onclick="DashboardPage.showDayDetail(${i})">
                                <div class="petal-dot" style="background: ${color}"></div>
                                <span class="petal-label">周${d.dayName}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
                <div class="week-summary">
                    <p>${this.getWeekSummary(weekData)}</p>
                </div>
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
        return `这周身体信号比较密集，尤其是周${worstDay.dayName}，你辛苦了。`;
    },

    showDayDetail(dayIndex) {
        this.state.selectedDay = dayIndex;
        const weekData = MockData.generateWeekData();
        const day = weekData[dayIndex];

        let detailHTML = '';
        if (day.record) {
            const symptoms = day.record.symptoms || {};
            const mood = day.record.mood || '未记录';
            detailHTML = `
                <div style="margin-top: 16px;">
                    <p style="margin-bottom: 12px;"><strong>心情：</strong>${mood}</p>
                    <h4 style="font-size: var(--font-caption); font-weight: 600; margin-bottom: 8px;">症状记录</h4>
                    ${MockData.symptomQuestions.map(q => {
                        const val = symptoms[q.id];
                        if (val === undefined) return '';
                        const level = MockData.severityLevels[val];
                        return `<div class="detail-symptom-row">
                            <span>${q.icon} ${q.field}</span>
                            <span class="detail-severity" style="color: ${level.color}">${level.label}</span>
                        </div>`;
                    }).join('')}
                </div>
            `;
        } else {
            detailHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 24px;">这天还没有记录</p>`;
        }

        DashboardPage.openDrawer(`
            <h3 style="margin-bottom: 16px;">${day.date.slice(5)} 周${day.dayName}</h3>
            ${detailHTML}
        `);
    },

    openDrawer(contentHTML) {
        this.closeDrawer();
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        overlay.onclick = () => this.closeDrawer();
        const drawer = document.createElement('div');
        drawer.className = 'drawer';
        drawer.innerHTML = `<div class="drawer-handle"></div>${contentHTML}`;
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

    /* ======= MONTH VIEW ======= */
    renderMonth() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const records = AppData.getAllRecords();
        const journals = AppData.getJournals();

        let recordDays = 0, journalDays = 0;
        Object.keys(records).forEach(k => {
            const d = new Date(k);
            if (d.getFullYear() === year && d.getMonth() === month) recordDays++;
        });
        Object.keys(journals).forEach(k => {
            const d = new Date(k);
            if (d.getFullYear() === year && d.getMonth() === month) journalDays++;
        });

        let calHTML = '<div class="month-calendar"><div class="cal-header">';
        ['日', '一', '二', '三', '四', '五', '六'].forEach(d => { calHTML += `<span class="cal-header-cell">${d}</span>`; });
        calHTML += '</div><div class="cal-grid">';
        for (let i = 0; i < firstDay; i++) calHTML += '<span class="cal-cell empty"></span>';
        for (let d = 1; d <= daysInMonth; d++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
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
            calHTML += `<span class="${cls}" style="background: ${bgColor}">${d}</span>`;
        }
        calHTML += '</div></div>';

        return `
            <div>
                <h3 style="margin-bottom: 12px; font-weight: 600;">${year}年${month + 1}月</h3>
                ${calHTML}
                <div class="stat-row">
                    <div class="stat-card">
                        <div class="stat-label">身心不适记录</div>
                        <div class="stat-number">${recordDays}</div>
                        <div class="stat-label">天</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">勇敢尝试记录</div>
                        <div class="stat-number">${journalDays}</div>
                        <div class="stat-label">天</div>
                    </div>
                </div>
                ${this.renderSymptomBreakdown(records, year, month)}
                ${this.renderReportSection()}
            </div>
        `;
    },

    /* ======= STAT MODULES ======= */
    renderStatModules() {
        const records = AppData.getAllRecords();
        const journals = AppData.getJournals();
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();

        let recordDays = 0, journalDays = 0;
        Object.keys(records).forEach(k => {
            const d = new Date(k);
            if (d.getFullYear() === year && d.getMonth() === month) recordDays++;
        });
        Object.keys(journals).forEach(k => {
            const d = new Date(k);
            if (d.getFullYear() === year && d.getMonth() === month) journalDays++;
        });

        return `
            <h3 class="dashboard-section-title">本月记录活跃度</h3>
            <div class="stat-row">
                <div class="stat-card">
                    <div class="stat-label">本月记录了身心不适</div>
                    <div class="stat-number">${recordDays}</div>
                    <div class="stat-label">天</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">我做了勇敢尝试</div>
                    <div class="stat-number">${journalDays}</div>
                    <div class="stat-label">天</div>
                </div>
            </div>
            ${this.renderSymptomBreakdown(records, year, month)}
        `;
    },

    /* ======= SYMPTOM BREAKDOWN ======= */
    renderSymptomBreakdown(records, year, month) {
        const fields = ['hotFlash', 'sleep', 'mood', 'fatigue', 'pain', 'memory', 'libido', 'incontinence'];
        const icons = ['🌡️','🌙','💭','🍃','🦴','🧠','💫','💧'];
        const counts = {};
        fields.forEach(f => { counts[f] = { total: 0, mild: 0, moderate: 0, severe: 0, trend: [] }; });

        Object.entries(records).forEach(([dateKey, rec]) => {
            const d = new Date(dateKey);
            if (d.getFullYear() !== year || d.getMonth() !== month) return;
            const symptoms = rec.symptoms || {};
            fields.forEach((f, i) => {
                const v = symptoms[i + 1];
                if (v !== undefined && v > 0) {
                    counts[f].total++;
                    if (v === 1) counts[f].mild++;
                    if (v === 2) counts[f].mild++; counts[f].moderate++;
                    if (v === 2) counts[f].moderate++;
                    if (v === 3) { counts[f].moderate++; counts[f].severe++; }
                    if (v === 4) counts[f].severe++;
                    counts[f].trend.push({ date: dateKey, value: v });
                }
            });
        });

        const sorted = fields.map(f => ({ field: f, ...counts[f] })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);
        const totalAll = sorted.reduce((s, c) => s + c.total, 0);
        const top4 = sorted.slice(0, 4);

        if (totalAll === 0) {
            return `<div class="viz-card"><p style="text-align:center; color: var(--text-secondary); padding: 24px;">本月还没有症状记录，开始记录后这里会显示统计</p></div>`;
        }

        return `
            <h3 class="dashboard-section-title">本月症状统计</h3>
            <div class="viz-card">
                <h4>8种症状整体分布</h4>
                <div class="symptom-grid">
                    ${fields.map((f, i) => {
                        const c = counts[f];
                        const pct = totalAll > 0 ? (c.total / totalAll * 100) : 0;
                        return `
                            <div class="symptom-grid-item">
                                <div class="symptom-name">${icons[i]} ${['潮热','睡眠','情绪','疲劳','疼痛','记忆','性欲','尿频'][i]}</div>
                                <div class="symptom-count">${c.total}</div>
                                <div class="symptom-bar"><div class="symptom-bar-fill" style="width:${pct}%"></div></div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            ${top4.length > 0 ? `
            <div class="viz-card">
                <h4>前${top4.length}个症状轻重层级关系</h4>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">🌿 轻度 · 🌼 中度 · 🍑 重度（三层可能有交集）</p>
                <div class="venn-container">
                    <div class="venn-circle mild">轻度<br>${top4.reduce((s,c) => s+c.mild,0)}次</div>
                    <div class="venn-circle moderate">中度<br>${top4.reduce((s,c) => s+c.moderate,0)}次</div>
                    <div class="venn-circle severe">重度<br>${top4.reduce((s,c) => s+c.severe,0)}次</div>
                </div>
            </div>
            ` : ''}

            ${top4.filter(c => c.trend.length >= 3).length > 0 ? `
            <div class="viz-card">
                <h4>症状加剧趋势</h4>
                <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px;">仅当本月记录有"轻→中→重"趋势时显示</p>
                ${top4.filter(c => c.trend.length >= 3).map(c => {
                    const vals = c.trend.map(t => t.value);
                    const increasing = vals[vals.length - 1] > vals[0];
                    if (!increasing) return '';
                    return `
                        <div style="margin-bottom:12px;">
                            <p style="font-size:13px;font-weight:600;margin-bottom:4px;">${icons[fields.indexOf(c.field)]} ${['潮热','睡眠','情绪','疲劳','疼痛','记忆','性欲','尿频'][fields.indexOf(c.field)]}</p>
                            <div class="trend-chart">
                                ${c.trend.map(t => {
                                    const h = (t.value / 4) * 100;
                                    const colors = ['#A3C9A8','#F5D68A','#F4C2A1','#e8a07a'];
                                    return `<div class="trend-bar" style="height:${h}%; background:${colors[t.value]}"></div>`;
                                }).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
            ` : ''}
        `;
    },

    /* ======= REPORT & SHARE ======= */
    renderReportSection() {
        return `
            <div class="report-section">
                <h3>报告与分享</h3>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.showReport('week')">生成周度报告</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.showReport('month')">生成月度报告</button>
                </div>
                <button class="btn btn-primary" style="width:100%;" onclick="DashboardPage.showShareModal()">分享给亲友</button>
            </div>
        `;
    },

    showReport(type) {
        const label = type === 'week' ? '周度' : '月度';
        this.openDrawer(`
            <div class="drawer-handle"></div>
            <h3 style="margin-bottom: 12px;">${label}报告预览</h3>
            <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-bottom: 16px;">报告包含：趋势总结、主要困扰变化、正向事件回顾</p>
            <div style="background: var(--bg-primary); border-radius: var(--radius-sm); padding: 20px; min-height: 150px; font-size: var(--font-caption); color: var(--text-secondary); line-height: 1.8;">
                <p>📊 <strong>趋势总结</strong></p>
                <p style="margin-bottom: 12px;">近期状态有所波动，部分信号值得关注。</p>
                <p>✨ <strong>正向事件回顾</strong></p>
                <p>本${label === '周度' ? '周' : '月'}你坚持记录了${type === 'week' ? '3' : '12'}次身心感受，这是对自己的温柔关注。</p>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 16px;">
                <button class="btn btn-primary" style="flex:1" onclick="DashboardPage.closeDrawer(); DashboardPage.showShareModal()">分享报告</button>
                <button class="btn btn-secondary" style="flex:1" onclick="DashboardPage.closeDrawer()">关闭</button>
            </div>
        `);
    },

    /* ======= SHARE MODAL ======= */
    showShareModal() {
        this.closeDrawer();
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        overlay.onclick = () => { overlay.remove(); document.querySelector('.share-modal')?.remove(); };

        const modal = document.createElement('div');
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                    <h3 style="font-size:var(--font-h2);">分享给</h3>
                    <button style="width:44px;height:44px;border:none;background:none;font-size:20px;cursor:pointer;"
                        onclick="document.querySelector('.drawer-overlay')?.remove(); document.querySelector('.share-modal')?.remove()">✕</button>
                </div>
                <div class="share-audience-tabs">
                    <button class="share-audience-btn ${this.state.shareAudience==='partner'?'active':''}" onclick="DashboardPage.selectAudience('partner')">致伴侣</button>
                    <button class="share-audience-btn ${this.state.shareAudience==='family'?'active':''}" onclick="DashboardPage.selectAudience('family')">致子女</button>
                    <button class="share-audience-btn ${this.state.shareAudience==='friend'?'active':''}" onclick="DashboardPage.selectAudience('friend')">致朋友</button>
                    <button class="share-audience-btn ${this.state.shareAudience==='doctor'?'active':''}" onclick="DashboardPage.selectAudience('doctor')">致医生</button>
                </div>
                <div class="share-preview ${this.getShareTemplateClass()}">
                    ${this.getShareTemplateContent()}
                </div>
                <div class="share-actions">
                    <button class="btn btn-primary" style="flex:1" onclick="App.showToast('分享功能开发中')">采用模板并分享</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="App.showToast('自定义功能开发中')">自定义内容</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        requestAnimationFrame(() => overlay.classList.add('show'));
    },

    selectAudience(audience) {
        this.state.shareAudience = audience;
        const content = document.querySelector('.share-modal-content');
        if (!content) return;
        content.querySelectorAll('.share-audience-btn').forEach(b => b.classList.remove('active'));
        content.querySelector(`.share-audience-btn:nth-child(${{partner:1,family:2,friend:3,doctor:4}[audience]})`).classList.add('active');
        const preview = content.querySelector('.share-preview');
        preview.className = `share-preview ${this.getShareTemplateClass()}`;
        preview.innerHTML = this.getShareTemplateContent();
    },

    getShareTemplateClass() {
        return {
            partner: 'share-template-partner',
            family: 'share-template-family',
            friend: 'share-template-friend',
            doctor: 'share-template-doctor'
        }[this.state.shareAudience];
    },

    getShareTemplateContent() {
        const templates = {
            partner: `
                <p style="font-size:var(--font-caption);color:var(--text-secondary);margin-bottom:8px;">🌅 温馨亲密 · 致伴侣</p>
                <p style="font-size:var(--font-body);font-weight:600;margin-bottom:8px;">最近身体有些变化，谢谢你一直陪在我身边。</p>
                <p style="font-size:var(--font-caption);color:var(--text-secondary);line-height:1.6;">这些信号是身体阶段变化的一部分，有你理解，我感觉好多了。</p>
            `,
            family: `
                <p style="font-size:var(--font-caption);color:var(--text-secondary);margin-bottom:8px;">🌿 关怀孝心 · 致子女</p>
                <p style="font-size:var(--font-body);font-weight:600;margin-bottom:8px;">妈妈最近身体有些变化，想跟你们分享一下。</p>
                <p style="font-size:var(--font-caption);color:var(--text-secondary);line-height:1.6;">这些是更年期阶段常见的信号，不用太担心，妈妈已经在关注和调整了。</p>
            `,
            friend: `
                <p style="font-size:var(--font-caption);color:var(--text-secondary);margin-bottom:8px;">💜 轻松活泼 · 致朋友</p>
                <p style="font-size:var(--font-body);font-weight:600;margin-bottom:8px;">嘿！最近身体在悄悄变化，想跟你聊聊～</p>
                <p style="font-size:var(--font-caption);color:var(--text-secondary);line-height:1.6;">姐妹你也有类似感受吗？一起分享下！</p>
            `,
            doctor: `
                <p style="font-size:var(--font-caption);color:var(--text-secondary);margin-bottom:8px;">📋 就诊备忘 · 致医生</p>
                <p style="font-size:var(--font-body);font-weight:600;margin-bottom:8px;">以下是我近期关注的身体变化，供您参考。</p>
                <p style="font-size:var(--font-caption);color:var(--text-secondary);line-height:1.6;">主要困扰：潮热、睡眠、情绪。详细数据如上。</p>
            `
        };
        return templates[this.state.shareAudience];
    }
};
