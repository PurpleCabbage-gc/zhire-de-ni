const KnowPage = {
    state: {
        view: 'home',
        step: 'basicInfo',
        currentQuestion: 0,
        ageRange: null,
        menstrualStatus: null,
        answers: [],
        chatMessages: [],
        chatLoading: false
    },

    render() {
        this.state.view = 'home';
        this.renderHome();
    },

    renderHome() {
        const settings = AppData.getSettings();
        const container = document.getElementById('page-container');
        const bookmarks = AppData.getBookmarks();
        const recentBookmarks = bookmarks.slice(0, 3);
        container.innerHTML = `
            <div class="page">
                <div class="greeting-section">
                    <h1 class="section-title">今天辛苦啦，${settings.userName}</h1>
                    <p class="section-subtitle">我们一起看看身体的变化吧</p>
                </div>

                <div class="card card-brand assessment-entry" onclick="KnowPage.startAssessment()">
                    <h2>3分钟，了解近期状态</h2>
                    <p>Kupperman国际标准量表 · 13项症状科学评估</p>
                    <button class="btn" style="background: rgba(255,255,255,0.95); color: var(--brand); margin-top: 14px; min-height: 56px; padding: 14px 24px; font-weight: 600; border-radius: 12px;">开始测评</button>
                </div>

                <div style="display:flex;gap:10px;margin-top:12px;">
                    <button class="btn btn-secondary" style="flex:1;" onclick="KnowPage.showHistory()">📋 历史测试结果</button>
                </div>
                <p class="retest-hint">${MockData.kuppermanIntro.retestNote}</p>

                <div class="ai-entry" onclick="KnowPage.showChat()" style="margin-top:16px;">
                    <div class="ai-entry-icon">🔍</div>
                    <span>问问暖知</span>
                    <span class="ai-entry-arrow">›</span>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 28px;">
                    <h3 style="font-size: var(--font-caption); font-weight: 600; color: var(--text-secondary);">我的安心卡</h3>
                    <span class="bookmark-view-all" onclick="KnowPage.showAllBookmarks()">查看全部 ›</span>
                </div>
                <div class="bookmark-scroll">
                    ${recentBookmarks.map(b => `
                        <div class="bookmark-card">
                            <h4>${b.title}</h4>
                            <p>${b.content}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    showAllBookmarks() {
        const bookmarks = AppData.getBookmarks();
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="KnowPage.render()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">全部安心卡</span>
                    <span></span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
                    ${bookmarks.map(b => `
                        <div class="bookmark-card" style="max-width: none; padding: 18px;">
                            <h4 style="font-size: var(--font-body);">${b.title}</h4>
                            <p style="font-size: var(--font-sm); color: var(--text-secondary); line-height: 1.6; margin-top: 6px;">${b.content}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    startAssessment() {
        this.state.currentQuestion = 0;
        this.state.answers = [];
        this.state.step = 'intro';
        this.state.view = 'assessment';
        this.renderIntro();
    },

    renderIntro() {
        const container = document.getElementById('page-container');
        const info = MockData.kuppermanIntro;
        container.innerHTML = `
            <div class="page assessment-page">
                <div class="assessment-header">
                    <button class="btn-back" onclick="KnowPage.renderHome()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">${info.title}</span>
                    <span></span>
                </div>
                <div class="card" style="margin-top: 16px; padding: 20px;">
                    <p style="font-size: var(--font-body); line-height: 1.8; color: var(--text); margin-bottom: 16px;">${info.description}</p>
                    <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-bottom: 6px;">${info.applicable}</p>
                    <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-bottom: 6px;">${info.privacy}</p>
                    <div style="padding: 12px; background: var(--yellow-soft); border-radius: 10px; margin-top: 12px;">
                        <p style="font-size: var(--font-caption); color: var(--text); line-height: 1.6;">${info.disclaimer}</p>
                    </div>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 24px;" onclick="KnowPage.renderBasicInfo()">
                    开始测试（共13题）
                </button>
            </div>
        `;
    },

    renderBasicInfo() {
        this.state.step = 'basicInfo';
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page assessment-page">
                <div class="assessment-header">
                    <button class="btn-back" onclick="KnowPage.renderIntro()">← 返回</button>
                    <span class="assessment-progress-text">基本信息</span>
                </div>
                <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-bottom: 4px;">第一部分（非评分项）</p>

                <div class="card" style="margin-top: 12px; padding: 20px;">
                    <h3 style="font-size: var(--font-body); font-weight: 600; margin-bottom: 12px;">您的年龄段：</h3>
                    ${MockData.kuppermanAgeRanges.map(r => `
                        <button class="option-btn basic-option ${this.state.ageRange === r.id ? 'selected' : ''}" style="display: block; width: 100%; text-align: left; margin-bottom: 8px;" onclick="KnowPage.selectAgeRange('${r.id}')">${r.label}</button>
                    `).join('')}
                </div>

                <div class="card" style="margin-top: 12px; padding: 20px;">
                    <h3 style="font-size: var(--font-body); font-weight: 600; margin-bottom: 12px;">月经状态：</h3>
                    ${MockData.kuppermanMenstrualStatus.map(m => `
                        <button class="option-btn basic-option ${this.state.menstrualStatus === m.id ? 'selected' : ''}" style="display: block; width: 100%; text-align: left; margin-bottom: 8px;" onclick="KnowPage.selectMenstrualStatus('${m.id}')">${m.label}</button>
                    `).join('')}
                </div>

                <button class="btn btn-primary" style="width: 100%; margin-top: 24px;" id="btnStartQuestions" ${(!this.state.ageRange || !this.state.menstrualStatus) ? 'disabled' : ''} onclick="KnowPage.startQuestions()">
                    确认，开始症状评分（第二部分）
                </button>
            </div>
        `;
    },

    selectAgeRange(id) {
        this.state.ageRange = id;
        this.renderBasicInfo();
    },

    selectMenstrualStatus(id) {
        this.state.menstrualStatus = id;
        this.renderBasicInfo();
    },

    startQuestions() {
        this.state.step = 'questions';
        this.state.currentQuestion = 0;
        this.renderQuestion();
    },

    renderQuestion() {
        const q = MockData.kuppermanQuestions[this.state.currentQuestion];
        const total = MockData.kuppermanQuestions.length;
        const progress = ((this.state.currentQuestion + 1) / total) * 100;
        const container = document.getElementById('page-container');
        const prevAnswer = this.state.answers.find(a => a.questionId === q.id);
        const selectedVal = prevAnswer ? prevAnswer.value : -1;

        container.innerHTML = `
            <div class="page assessment-page">
                <div class="assessment-header">
                    <button class="btn-back" onclick="KnowPage.exitAssessment()">← 返回</button>
                    <span class="assessment-progress-text">【${this.state.currentQuestion + 1}/${total}】</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="question-card">
                    <span class="question-badge">${q.symptom} (权重: ×${q.baseScore})</span>
                    <p class="question-text">${q.text}</p>
                    <div class="options-list">
                        ${q.degrees.map((opt, idx) => `
                            <button class="option-btn ${idx === selectedVal ? 'selected' : ''}" onclick="KnowPage.selectOption(${opt.value})">
                                ${opt.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div style="display: flex; gap: 12px; margin-top: 20px;">
                    ${this.state.currentQuestion > 0 ? `<button class="btn btn-ghost" style="flex: 1;" onclick="KnowPage.prevQuestion()">← 上一题</button>` : ''}
                    <button class="btn btn-ghost" style="flex: 1;" onclick="KnowPage.exitAssessment()">
                        暂不测试了
                    </button>
                </div>
            </div>
        `;
    },

    selectOption(value) {
        const q = MockData.kuppermanQuestions[this.state.currentQuestion];
        const existingIdx = this.state.answers.findIndex(a => a.questionId === q.id);
        if (existingIdx >= 0) {
            this.state.answers[existingIdx].value = value;
        } else {
            this.state.answers.push({ questionId: q.id, value });
        }

        const btns = document.querySelectorAll('.option-btn');
        btns[value].classList.add('selected');

        setTimeout(() => {
            if (this.state.currentQuestion < MockData.kuppermanQuestions.length - 1) {
                this.state.currentQuestion++;
                this.renderQuestion();
            } else {
                this.showResult();
            }
        }, 500);
    },

    prevQuestion() {
        if (this.state.currentQuestion > 0) {
            this.state.currentQuestion--;
            this.renderQuestion();
        }
    },

    showResult() {
        const result = MockData.calculateKuppermanScore(this.state.answers);
        const basicInfo = { ageRange: this.state.ageRange, menstrualStatus: this.state.menstrualStatus };
        const report = MockData.generateKuppermanReport(result, basicInfo);

        const severityColors = { normal: 'var(--brand)', mild: '#F5D68A', moderate: '#F4C2A1', severe: '#E76F51' };
        const severityColor = severityColors[result.severity];

        AppData.saveAssessment({
            type: 'kupperman',
            totalScore: result.totalScore,
            severity: result.severity,
            severityLabel: report.severityLabel,
            answers: this.state.answers,
            basicInfo: basicInfo,
            reportHtml: report.reportHtml,
            highScoreItems: report.highScoreItems,
            occasionalItems: report.occasionalItems
        });

        this.state.step = 'result';
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page result-page" style="animation: cardIn 400ms var(--ease-out)">
                <div class="result-status" style="background: ${severityColor}15; border-left: 4px solid ${severityColor}; padding: 20px; border-radius: 16px; margin-bottom: 20px;">
                    <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-bottom: 6px;">Kupperman 改良评分结果</p>
                    <div style="display: flex; align-items: baseline; gap: 8px;">
                        <span style="font-size: 48px; font-weight: 700; letter-spacing: -0.02em; color: ${severityColor};">${result.totalScore}</span>
                        <span style="font-size: var(--font-caption); color: var(--text-secondary);">/ 63 分</span>
                    </div>
                    <p style="font-size: var(--font-h2); font-weight: 700; margin-top: 4px;">${report.severityLabel}</p>
                    <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-top: 4px;">总分范围0-63分 | 轻度15-20分 | 中度20-35分 | 重度>35分</p>
                </div>

                <div class="card" style="padding: 20px; margin-bottom: 16px;">
                    ${report.reportHtml}
                </div>

                <div class="medical-reminder">
                    <p>以上内容仅供参考，不能替代医生诊断。如不适持续或加重，建议及时咨询专业医生。</p>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-primary" style="flex:1" onclick="DashboardPage.showSharePage()">分享</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="KnowPage.showHistory()">查看历史报告</button>
                </div>
                <button class="btn btn-ghost" style="width: 100%; margin-top: 10px;" onclick="KnowPage.render()">返回首页</button>
            </div>
        `;
    },

    exitAssessment() {
        App.showToast('进度已保存');
        this.renderHome();
    },

    showChat() {
        this.state.view = 'chat';
        this.state.chatMessages = [
            { role: 'ai', text: '你好呀！我是暖知。你有什么身体上的疑问，都可以问我。我会先在知识库中查找专业的解答给你。' }
        ];
        this.renderChat();
    },

    renderChat() {
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page chat-page">
                <div class="chat-header">
                    <button class="btn-back" onclick="KnowPage.render()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">问问暖知</span>
                    <button class="btn btn-ghost" style="font-size: var(--font-sm); padding: 4px 10px;" onclick="KnowPage.showApiKeyInput()" title="设置API Key">⚙️</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${this.state.chatMessages.map((m, idx) => `
                        <div class="chat-bubble ${m.role}">
                            ${m.role === 'ai' ? '<div class="chat-avatar">🌿</div>' : ''}
                            <div class="chat-content">
                                <div class="chat-text">${m.text.replace(/\n/g, '<br>')}</div>
                                ${m.role === 'ai' && idx > 0 ? `
                                    <div class="chat-actions">
                                        <button class="chat-action-btn" onclick="KnowPage.bookmarkAnswer(${idx})">⭐ 收藏</button>
                                        <button class="chat-action-btn" onclick="App.showToast('语音播报功能开发中')">🔊 播报</button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                    ${this.state.chatLoading ? `<div class="chat-bubble ai"><div class="chat-avatar">🌿</div><div class="chat-content"><div class="chat-text" style="color: var(--text-secondary);">暖知正在查找知识库<span class="loading-dots">...</span></div></div></div>` : ''}
                </div>
                <div class="chat-input-area">
                    <button class="btn btn-ghost" style="font-size:20px;min-width:44px;min-height:44px;padding:8px;" onclick="App.showToast('语音输入功能开发中')" title="语音输入">🎙️</button>
                    <input type="text" class="input-field chat-input" id="chatInput" placeholder="输入你的问题..." onkeypress="if(event.key==='Enter')KnowPage.sendMessage()" ${this.state.chatLoading ? 'disabled' : ''}>
                    <button class="btn btn-primary chat-send" onclick="KnowPage.sendMessage()" ${this.state.chatLoading ? 'disabled' : ''}>发送</button>
                </div>
            </div>
        `;
        const msgs = document.getElementById('chatMessages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
    },

    bookmarkAnswer(msgIdx) {
        const msg = this.state.chatMessages[msgIdx];
        if (!msg) return;
        const title = msg.text.substring(0, 30).replace(/<br>/g, ' ') + '...';
        const content = msg.text.replace(/<br>/g, '\n').replace(/\n\n⚠️.*$/, '').substring(0, 120);
        AppData.saveBookmark({ title, content });
        App.showToast('已收藏至安心卡 ⭐');
    },

    showApiKeyInput() {
        const currentKey = DeepSeekAPI.getApiKey();
        const masked = currentKey ? currentKey.substring(0, 8) + '...' + currentKey.substring(currentKey.length - 4) : '';
        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="KnowPage.showChat()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">AI 设置</span>
                    <span></span>
                </div>
                <div class="card" style="padding: 20px; margin-top: 16px;">
                    <p style="font-size: var(--font-body); line-height: 1.8; margin-bottom: 12px;">设置 DeepSeek API Key 后，暖知可以在知识库未覆盖的问题上，用 AI 为你生成温暖专业的回答。</p>
                    ${currentKey ? `<p style="font-size: var(--font-caption); color: var(--brand); margin-bottom: 12px;">已设置 Key：${masked}</p>` : `<p style="font-size: var(--font-caption); color: var(--alert); margin-bottom: 12px;">尚未设置 API Key</p>`}
                    <label style="font-size: var(--font-caption); color: var(--text-secondary); display: block; margin-bottom: 6px;">DeepSeek API Key：</label>
                    <input type="password" class="input-field" id="apiKeyInput" placeholder="sk-..." style="width: 100%; margin-bottom: 12px;" value="${currentKey}">
                    <p style="font-size: var(--font-xs); color: var(--text-muted); margin-bottom: 12px;">可在 <a href="https://platform.deepseek.com/api_keys" target="_blank" style="color: var(--brand);">platform.deepseek.com</a> 获取 API Key</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-primary" style="flex: 1;" onclick="KnowPage.saveApiKey()">保存</button>
                        ${currentKey ? `<button class="btn btn-ghost" style="flex: 1; color: var(--alert);" onclick="KnowPage.removeApiKey()">清除 Key</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    saveApiKey() {
        const input = document.getElementById('apiKeyInput');
        if (!input || !input.value.trim()) {
            App.showToast('请输入 API Key');
            return;
        }
        DeepSeekAPI.setApiKey(input.value.trim());
        App.showToast('API Key 已保存');
        this.showChat();
    },

    removeApiKey() {
        DeepSeekAPI.setApiKey('');
        App.showToast('API Key 已清除');
        this.showChat();
    },

    async sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input || this.state.chatLoading) return;
        const text = input.value.trim();
        if (!text) return;

        this.state.chatMessages.push({ role: 'user', text });
        input.value = '';
        this.state.chatLoading = true;
        this.renderChat();

        const kbMatch = KnowledgeBase.search(text);

        if (kbMatch) {
            const answer = '【知识库解答】\n\n' + kbMatch.answer + '\n\n如果症状持续加重或严重影响日常生活，建议咨询专业医生。\n\n⚠️ 以上内容参考权威专家共识，仅供参考，不能替代专业医疗诊断。';
            this.state.chatMessages.push({ role: 'ai', text: answer, source: 'knowledge_base' });
        } else {
            this.state.chatMessages.push({
                role: 'ai',
                text: '您的问题尚未录至知识库内，知识库将持续完善和更新。\n\n如需更多帮助，可以换个关键词试试，例如：潮热、失眠、情绪、运动、补钙等。',
                source: 'fallback'
            });
        }

        this.state.chatLoading = false;
        this.renderChat();
    },

    showHistory() {
        const history = AppData.getAssessmentHistory();
        const container = document.getElementById('page-container');

        if (history.length === 0) {
            container.innerHTML = `
                <div class="page">
                    <div class="chat-header">
                        <button class="btn-back" onclick="KnowPage.render()">← 返回</button>
                        <span style="font-weight: 600; font-size: var(--font-h2);">历史测试结果</span>
                        <span></span>
                    </div>
                    <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                        <p style="font-size: 48px; margin-bottom: 16px;">📋</p>
                        <p>还没有测评记录</p>
                        <p style="margin-top: 8px; font-size: var(--font-caption);">完成一次 Kupperman 测评后，结果会显示在这里</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="KnowPage.render()">← 返回</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">历史测试结果</span>
                    <span></span>
                </div>
                <p class="retest-hint" style="margin-top: 8px; margin-bottom: 16px; color: var(--brand); font-weight: 600;">↓ 点击任意一条记录，查看完整报告</p>
                <div class="history-list">
                    ${history.map((h, idx) => {
                        const date = new Date(h.date);
                        const dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
                        const severityColors = { normal: '#A3C9A8', mild: '#F5D68A', moderate: '#F4C2A1', severe: '#E76F51' };
                        const color = severityColors[h.severity] || 'var(--brand)';
                        return '<div class="card history-card-clickable" style="margin-bottom: 12px; border-left: 4px solid ' + color + '; cursor: pointer;" onclick="KnowPage.viewReport(' + idx + ')">' +
                            '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                                '<div><span style="font-weight: 600;">' + dateStr + '</span><span style="font-size: var(--font-sm); color: var(--text-secondary); margin-left: 8px;">Kupperman 量表</span></div>' +
                                '<span style="font-size: var(--font-sm); color: var(--brand);">查看完整报告 ›</span>' +
                            '</div>' +
                            '<div style="margin-top: 8px; display: flex; align-items: center; gap: 12px;">' +
                                '<span style="font-size: 28px; font-weight: 700; color: ' + color + ';">' + h.totalScore + '</span>' +
                                '<span style="font-size: var(--font-sm); color: var(--text-secondary);">/ 63分 · ' + h.severityLabel + '</span>' +
                            '</div>' +
                        '</div>';
                    }).join('')}
                </div>
            </div>
        `;
    },

    viewReport(index) {
        const history = AppData.getAssessmentHistory();
        const h = history[index];
        if (!h) { App.showToast('报告数据不存在'); return; }

        const severityColors = { normal: '#A3C9A8', mild: '#F5D68A', moderate: '#F4C2A1', severe: '#E76F51' };
        const color = severityColors[h.severity] || 'var(--brand)';
        const date = new Date(h.date);
        const dateStr = date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日 ' + date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');

        let reportBody = h.reportHtml || '';
        if (!reportBody && h.answers) {
            const result = MockData.calculateKuppermanScore(h.answers);
            const report = MockData.generateKuppermanReport(result, h.basicInfo || {});
            reportBody = report.reportHtml;
        }

        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page result-page">
                <div class="chat-header">
                    <button class="btn-back" onclick="KnowPage.showHistory()">← 返回历史</button>
                    <span style="font-weight: 600; font-size: var(--font-h2);">历史报告</span>
                    <span></span>
                </div>
                <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-top: 8px;">测评时间：${dateStr}</p>
                <div class="result-status" style="background: ${color}15; border-left: 4px solid ${color}; padding: 20px; border-radius: 16px; margin-bottom: 20px; margin-top: 12px;">
                    <p style="font-size: var(--font-caption); color: var(--text-secondary); margin-bottom: 6px;">Kupperman 改良评分结果</p>
                    <div style="display: flex; align-items: baseline; gap: 8px;">
                        <span style="font-size: 48px; font-weight: 700; letter-spacing: -0.02em; color: ${color};">${h.totalScore}</span>
                        <span style="font-size: var(--font-caption); color: var(--text-secondary);">/ 63 分</span>
                    </div>
                    <p style="font-size: var(--font-h2); font-weight: 700; margin-top: 4px;">${h.severityLabel}</p>
                </div>
                <div class="card" style="padding: 20px; margin-bottom: 16px;">${reportBody}</div>
                <div class="medical-reminder"><p>以上内容仅供参考，不能替代医生诊断。如不适持续或加重，建议及时咨询专业医生。</p></div>
                <div style="display:flex;gap:10px;margin-top:16px;">
                    <button class="btn btn-primary" style="flex:1" onclick="DashboardPage.showSharePage()">分享</button>
                    <button class="btn btn-ghost" style="flex:1" onclick="KnowPage.showHistory()">← 返回历史列表</button>
                </div>
            </div>
        `;
    }
};

