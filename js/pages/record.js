const RecordPage = {
    state: {
        tab: 'symptom',
        currentSymptom: 0,
        symptoms: {},
        mood: null
    },

    render() {
        this.state.currentSymptom = 0;
        this.state.symptoms = {};
        this.state.mood = null;
        this.state.tab = 'symptom';
        this.renderMain();
    },

    renderMain() {
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page">
                ${this.renderDateBar()}
                <div class="segment-control">
                    <button class="segment-btn ${this.state.tab === 'symptom' ? 'active' : ''}" onclick="RecordPage.switchTab('symptom')">身心便利贴</button>
                    <button class="segment-btn ${this.state.tab === 'journal' ? 'active' : ''}" onclick="RecordPage.switchTab('journal')">战斗小日志</button>
                </div>
                <div id="record-content">
                    ${this.state.tab === 'symptom' ? this.renderSymptomCard() : this.renderJournal()}
                </div>
            </div>
        `;
    },

    renderDateBar() {
        const days = [];
        const today = new Date();
        for (let i = -3; i <= 3; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() + i);
            days.push({
                dayName: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
                dayNum: d.getDate(),
                isToday: i === 0
            });
        }
        return `
            <div class="date-bar">
                ${days.map(d => `
                    <div class="date-item ${d.isToday ? 'active' : ''}">
                        <span class="day-name">${d.dayName}</span>
                        <span class="day-num">${d.dayNum}</span>
                    </div>
                `).join('')}
            </div>
        `;
    },

    switchTab(tab) {
        this.state.tab = tab;
        this.renderMain();
    },

    renderSymptomCard() {
        const existing = AppData.getTodayRecord();
        if (existing && !this.state.inProgress) {
            return this.renderTodayDone(existing);
        }

        this.state.inProgress = true;
        const questions = MockData.symptomQuestions;
        if (this.state.currentSymptom >= questions.length) {
            return this.renderMoodPicker();
        }

        const q = questions[this.state.currentSymptom];
        const total = questions.length + 1;

        return `
            <div class="symptom-card" style="animation: cardIn 400ms var(--ease-out)">
                <div class="symptom-progress">【${this.state.currentSymptom + 1}/${total}】</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${((this.state.currentSymptom + 1) / total) * 100}%"></div>
                </div>
                <div class="symptom-icon">${q.icon}</div>
                <h3 class="symptom-title">${q.text}</h3>
                <div class="severity-buttons">
                    ${MockData.severityLevels.map(s => `
                        <button class="severity-btn" onclick="RecordPage.selectSeverity(${s.value})">
                            <span class="severity-dot" style="background: ${s.color}"></span>
                            <span>${s.label}</span>
                        </button>
                    `).join('')}
                </div>
                <div class="symptom-nav">
                    <button class="btn btn-voice" style="min-height:48px;font-size:14px;" onclick="RecordPage.showVoicePermission()">🎙️ 语音</button>
                    <div style="display:flex;gap:8px;">
                        ${this.state.currentSymptom > 0 ? `<button class="btn btn-ghost" onclick="RecordPage.prevSymptom()">上一题</button>` : ''}
                        <button class="btn btn-ghost" onclick="RecordPage.skipSymptom()">下一个</button>
                    </div>
                </div>
            </div>
        `;
    },

    showVoicePermission() {
        const container = document.getElementById('record-content');
        container.innerHTML = `
            <div class="card" style="padding: 24px; text-align: center; animation: cardIn 300ms var(--ease-out)">
                <p style="font-size: 36px; margin-bottom: 12px;">🎙️</p>
                <h3 style="margin-bottom: 8px;">需要使用麦克风</h3>
                <p style="font-size: var(--font-caption); color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px;">
                    为了使用语音输入功能，需要获取您的麦克风权限。<br>录音内容仅用于本地文字转换，不会上传至任何服务器。
                </p>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-ghost" style="flex:1;" onclick="document.getElementById('record-content').innerHTML = RecordPage.renderSymptomCard()">不了，谢谢</button>
                    <button class="btn btn-primary" style="flex:1;" onclick="App.showToast('语音输入功能开发中'); document.getElementById('record-content').innerHTML = RecordPage.renderSymptomCard();">允许</button>
                </div>
            </div>
        `;
    },

    selectSeverity(value) {
        const q = MockData.symptomQuestions[this.state.currentSymptom];
        this.state.symptoms[q.id] = value;
        setTimeout(() => {
            this.state.currentSymptom++;
            document.getElementById('record-content').innerHTML = this.renderSymptomCard();
        }, 1000);
    },

    prevSymptom() {
        if (this.state.currentSymptom > 0) {
            this.state.currentSymptom--;
            document.getElementById('record-content').innerHTML = this.renderSymptomCard();
        }
    },

    skipSymptom() {
        this.state.currentSymptom++;
        document.getElementById('record-content').innerHTML = this.renderSymptomCard();
    },

    renderMoodPicker() {
        return `
            <div class="mood-card" style="animation: cardIn 400ms var(--ease-out)">
                <h3 class="symptom-title">今天的心情是？</h3>
                <div class="mood-grid">
                    ${MockData.moods.map(m => `
                        <button class="mood-btn" onclick="RecordPage.selectMood('${m.label}')">
                            <span class="mood-emoji">${m.emoji}</span>
                            <span class="mood-label">${m.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    selectMood(mood) {
        this.state.mood = mood;
        AppData.saveRecord({ symptoms: this.state.symptoms, mood });
        this.state.inProgress = false;
        this.showFeedback();
    },

    showFeedback() {
        const encouragement = MockData.encouragements[Math.floor(Math.random() * MockData.encouragements.length)];
        const container = document.getElementById('record-content');
        container.innerHTML = `
            <div class="feedback-card" style="animation: cardIn 600ms var(--ease-spring)">
                <div class="feedback-icon">📝</div>
                <h3 style="margin: 16px 0 8px;">记录完成！</h3>
                <p class="feedback-text">${encouragement}</p>
                <div class="feedback-suggestion">
                    <p style="font-size: 15px; color: var(--text-secondary); margin-bottom: 8px;">暖知建议：</p>
                    <p>今天可以先从一个很小的照顾动作开始，比如给自己倒杯温水。</p>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 20px;" onclick="RecordPage.renderMain()">好的</button>
            </div>
        `;
    },

    renderTodayDone(record) {
        return `
            <div class="today-done">
                <div class="feedback-icon">✅</div>
                <h3>今天已经记录过啦</h3>
                <p style="color: var(--text-secondary); margin: 8px 0;">心情：${record.mood || '未记录'}</p>
                <button class="btn btn-secondary" style="margin-top: 16px;" onclick="RecordPage.state.inProgress=true; RecordPage.state.currentSymptom=0; RecordPage.state.symptoms={}; document.getElementById('record-content').innerHTML = RecordPage.renderSymptomCard();">重新记录</button>
            </div>
        `;
    },

    renderJournal() {
        const today = new Date();
        const dateStr = today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日';
        const journals = AppData.getJournals();
        const todayKey = today.toISOString().slice(0, 10);
        const existing = journals[todayKey];

        return `
            <div class="journal-page" style="animation: pageIn 300ms var(--ease-out)">
                <div class="journal-book">
                    <div class="journal-spine"></div>
                    <div class="journal-date">${dateStr}</div>
                    <div class="journal-weather">
                        <span>天气：</span>
                        <button class="weather-btn" onclick="this.classList.toggle('active')">☀️</button>
                        <button class="weather-btn" onclick="this.classList.toggle('active')">⛅</button>
                        <button class="weather-btn" onclick="this.classList.toggle('active')">🌧️</button>
                        <button class="weather-btn" onclick="this.classList.toggle('active')">❄️</button>
                    </div>
                    <label class="journal-label">我的积极行动记录</label>
                    <textarea class="journal-textarea input-field" id="journalText" rows="5" placeholder="写下今天做过的积极小事...">${existing ? existing.text : ''}</textarea>
                    <div class="quick-phrases">
                        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 8px;">快捷短语：</p>
                        <div class="phrase-list">
                            ${MockData.quickPhrases.map(p => `
                                <button class="phrase-btn" onclick="RecordPage.addPhrase('${p}')">${p}</button>
                            `).join('')}
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px; margin-top: 20px;">
                        <button class="btn btn-ghost" style="flex: 1;" onclick="RecordPage.showVoicePermission()">🎙️ 语音输入</button>
                        <button class="btn btn-primary" style="flex: 1;" onclick="RecordPage.saveJournal()">保存日志</button>
                    </div>
                </div>
            </div>
        `;
    },

    addPhrase(phrase) {
        const textarea = document.getElementById('journalText');
        textarea.value += (textarea.value ? '\n' : '') + phrase;
    },

    saveJournal() {
        const text = document.getElementById('journalText').value.trim();
        if (!text) {
            App.showToast('写点什么再保存吧');
            return;
        }
        AppData.saveJournal({ text });
        App.showToast('收到，今天你真的很棒哦！');
    }
};

