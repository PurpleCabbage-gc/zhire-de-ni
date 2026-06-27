const KnowPage = {
    state: {
        view: 'home',
        step: 'basicInfo',
        currentQuestion: 0,
        ageRange: null,
        menstrualStatus: null,
        answers: [],
        chatMessages: []
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
                    <button class="btn" style="background: rgba(255,255,255,0.95); color: var(--brand); margin-top: 14px; min-height: 44px; padding: 10px 20px; font-weight: 600; border-radius: 12px;">开始测评</button>
                </div>

                <div class="ai-entry" onclick="KnowPage.showChat()">
                    <div class="ai-entry-icon">💬</div>
                    <span>哪里不舒服？我帮你先理一理</span>
                    <span class="ai-entry-arrow">›</span>
                </div>

                <div class="history-link" onclick="KnowPage.showHistory()">
                    <span>📋 历史测试结果</span>
                    <span class="ai-entry-arrow">›</span>
                </div>
                <p class="retest-hint">${MockData.kuppermanIntro.retestNote}</p>

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
                            <h4 style="font-size: 16px;">${b.title}</h4>
                            <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-top: 6px;">${b.content}</p>
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
        const ageLabels = {};
        MockData.kuppermanAgeRanges.forEach(r => { ageLabels[r.id] = r.label; });
        App.showToast('已选择：' + ageLabels[id]);
        this.renderBasicInfo();
    },

    selectMenstrualStatus(id) {
        this.state.menstrualStatus = id;
        const mensLabels = {};
        MockData.kuppermanMenstrualStatus.forEach(m => { mensLabels[m.id] = m.label; });
        App.showToast('已选择：' + mensLabels[id]);
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

        container.innerHTML = `
            <div class="page assessment-page">
                <div class="assessment-header">
                    <button class="btn-back" onclick="KnowPage.exitAssessment()">← 返回</button>
                    <span class="assessment-progress-text">第 ${this.state.currentQuestion + 1} / ${total} 题</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <div class="question-card">
                    <span class="question-badge" style="display:inline-block; padding:4px 12px; border-radius:20px; font-size:13px; font-weight:600; background: var(--peach); color:#fff; margin-bottom:12px;">${q.symptom} (权重: ×${q.baseScore})</span>
                    <p class="question-text">${q.text}</p>
                    <div class="options-list">
                        ${q.degrees.map(opt => `
                            <button class="option-btn" onclick="KnowPage.selectOption(${opt.value})">
                                ${opt.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <button class="btn btn-ghost" style="width: 100%; margin-top: 20px;" onclick="KnowPage.exitAssessment()">
                    暂时不想测了，下次继续
                </button>
            </div>
        `;
    },

    selectOption(value) {
        const q = MockData.kuppermanQuestions[this.state.currentQuestion];
        this.state.answers.push({ questionId: q.id, value });

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

    showResult() {
        const result = MockData.calculateKuppermanScore(this.state.answers);
        const basicInfo = { ageRange: this.state.ageRange, menstrualStatus: this.state.menstrualStatus };
        const report = MockData.generateKuppermanReport(result, basicInfo);

        const severityColors = {
            normal: 'var(--brand)',
            mild: '#F5D68A',
            moderate: '#F4C2A1',
            severe: '#E76F51'
        };
        const severityColor = severityColors[result.severity];

        AppData.saveAssessment({
            type: 'kupperman',
            totalScore: result.totalScore,
            severity: result.severity,
            severityLabel: report.severityLabel,
            answers: this.state.answers,
            basicInfo: basicInfo
        });

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
                    <button class="btn btn-primary" style="flex:1" onclick="App.showToast('分享功能开发中')">生成亲友小卡</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="KnowPage.showHistory()">查看完整报告</button>
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
            { role: 'ai', text: MockData.aiResponses.greeting[0] }
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
                    <span></span>
                </div>
                <div class="chat-messages" id="chatMessages">
                    ${this.state.chatMessages.map(m => `
                        <div class="chat-bubble ${m.role}">
                            ${m.role === 'ai' ? '<div class="chat-avatar">🌿</div>' : ''}
                            <div class="chat-text">${m.text.replace(/\n/g, '<br>')}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="chat-input-area">
                    <input type="text" class="input-field chat-input" id="chatInput" placeholder="输入你的问题..." onkeypress="if(event.key==='Enter')KnowPage.sendMessage()">
                    <button class="btn btn-voice" onclick="App.showToast('语音输入功能开发中')" title="语音输入">🎙️</button>
                    <button class="btn btn-primary chat-send" onclick="KnowPage.sendMessage()">发送</button>
                </div>
            </div>
        `;
        const msgs = document.getElementById('chatMessages');
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
    },

    sendMessage() {
        const input = document.getElementById('chatInput');
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        this.state.chatMessages.push({ role: 'user', text });
        input.value = '';

        let response = MockData.aiResponses.default;
        if (text.includes('潮热') || text.includes('发热') || text.includes('出汗')) {
            response = MockData.aiResponses.hotFlash;
        } else if (text.includes('睡') || text.includes('失眠')) {
            response = MockData.aiResponses.sleep;
        } else if (text.includes('情绪') || text.includes('焦虑') || text.includes('烦')) {
            response = MockData.aiResponses.emotion;
        }

        setTimeout(() => {
            this.state.chatMessages.push({ role: 'ai', text: response });
            this.renderChat();
        }, 800);

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
                <p class="retest-hint" style="margin-top: 8px; margin-bottom: 16px;">${MockData.kuppermanIntro.retestNote}</p>
                <div class="history-list">
                    ${history.map(h => {
                        const date = new Date(h.date);
                        const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
                        const severityColors = { normal: '#A3C9A8', mild: '#F5D68A', moderate: '#F4C2A1', severe: '#E76F51' };
                        const color = severityColors[h.severity] || 'var(--brand)';
                        return `
                            <div class="card" style="margin-bottom: 12px; border-left: 4px solid ${color};">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <span style="font-weight: 600;">${dateStr}</span>
                                        <span style="font-size: 13px; color: var(--text-secondary); margin-left: 8px;">Kupperman 量表</span>
                                    </div>
                                </div>
                                <div style="margin-top: 8px; display: flex; align-items: center; gap: 12px;">
                                    <span style="font-size: 28px; font-weight: 700; color: ${color};">${h.totalScore}</span>
                                    <span style="font-size: 13px; color: var(--text-secondary);">/ 63分 · ${h.severityLabel}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};
