const KnowPage = {
    state: {
        view: 'home',
        currentQuestion: 0,
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
        container.innerHTML = `
            <div class="page">
                <div class="greeting-section">
                    <h1 class="section-title">今天辛苦啦，${settings.userName}！</h1>
                    <p class="section-subtitle">我们一起看看身体的变化吧</p>
                </div>

                <div class="card card-brand assessment-entry" onclick="KnowPage.startAssessment()">
                    <div class="assessment-entry-content">
                        <h2 style="font-size: 22px; margin-bottom: 8px;">3分钟，了解近期状态</h2>
                        <p style="opacity: 0.9; margin-bottom: 16px;">15道小题，帮你梳理身体信号</p>
                        <button class="btn" style="background: white; color: var(--brand-dark); font-weight: 700;">开始测评</button>
                    </div>
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

                <div class="section-title" style="margin-top: 24px; font-size: 20px;">我的安心卡</div>
                <div class="bookmark-scroll">
                    ${bookmarks.map(b => `
                        <div class="bookmark-card">
                            <h4>${b.title}</h4>
                            <p>${b.content}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    startAssessment() {
        this.state.currentQuestion = 0;
        this.state.answers = [];
        this.state.view = 'assessment';
        this.renderQuestion();
    },

    renderQuestion() {
        const q = MockData.assessmentQuestions[this.state.currentQuestion];
        const total = MockData.assessmentQuestions.length;
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
                <div class="question-card" style="animation: bounceIn 0.3s ease">
                    <p class="question-text">${q.text}</p>
                    <div class="options-list">
                        ${MockData.assessmentOptions.map(opt => `
                            <button class="option-btn" onclick="KnowPage.selectOption(${opt.value})">
                                ${opt.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <button class="btn btn-ghost" style="width: 100%; margin-top: 20px;" onclick="KnowPage.exitAssessment()">
                    暂时不想测了，保存进度
                </button>
            </div>
        `;
    },

    selectOption(value) {
        const q = MockData.assessmentQuestions[this.state.currentQuestion];
        this.state.answers.push({ questionId: q.id, category: q.category, value });

        const btns = document.querySelectorAll('.option-btn');
        btns[value].classList.add('selected');

        setTimeout(() => {
            if (this.state.currentQuestion < MockData.assessmentQuestions.length - 1) {
                this.state.currentQuestion++;
                this.renderQuestion();
            } else {
                this.showResult();
            }
        }, 500);
    },

    showResult() {
        const answers = this.state.answers;
        const categoryScores = {};
        answers.forEach(a => {
            if (!categoryScores[a.category]) categoryScores[a.category] = 0;
            categoryScores[a.category] += a.value;
        });

        const sorted = Object.entries(categoryScores).sort((a, b) => b[1] - a[1]);
        const topConcerns = sorted.slice(0, 3).map(([cat]) => cat);
        const totalScore = answers.reduce((sum, a) => sum + a.value, 0);
        const maxScore = answers.length * 3;
        const ratio = totalScore / maxScore;

        let statusLabel, statusColor;
        if (ratio < 0.25) { statusLabel = '状态不错，继续保持'; statusColor = 'var(--brand)'; }
        else if (ratio < 0.5) { statusLabel = '有些信号值得留意'; statusColor = '#f0d9a0'; }
        else { statusLabel = '需要多照顾自己'; statusColor = 'var(--peach)'; }

        AppData.saveAssessment({ answers, topConcerns, totalScore, statusLabel });

        const container = document.getElementById('page-container');
        container.innerHTML = `
            <div class="page result-page" style="animation: bounceIn 0.4s ease">
                <div class="result-status" style="background: ${statusColor}20; border: 2px solid ${statusColor}; border-radius: var(--radius-lg); padding: 20px; text-align: center; margin-bottom: 24px;">
                    <span style="font-size: 24px; font-weight: 700; color: ${statusColor === 'var(--brand)' ? 'var(--brand-dark)' : statusColor}">今日状态：${statusLabel}</span>
                </div>

                <h3 style="margin-bottom: 12px;">近期主要关注点</h3>
                <div class="concern-tags">
                    ${topConcerns.map(c => `<span class="concern-tag">${c}</span>`).join('')}
                </div>

                <h3 style="margin: 24px 0 12px;">今日可以尝试</h3>
                <div class="suggestions-list">
                    <div class="suggestion-item">🌿 今天可以试试睡前做5分钟腹式呼吸</div>
                    <div class="suggestion-item">💧 给自己倒一杯温水，慢慢喝完</div>
                    <div class="suggestion-item">🚶‍♀️ 下午找个时间散步10分钟</div>
                </div>

                <div class="medical-reminder">
                    <p>⚠️ 以上内容仅供参考，不能替代医生诊断。如不适持续或加重，建议及时咨询专业医生。</p>
                </div>

                <div style="display: flex; gap: 12px; margin-top: 24px;">
                    <button class="btn btn-primary" style="flex:1" onclick="App.showToast('分享功能开发中')">生成亲友小卡</button>
                    <button class="btn btn-secondary" style="flex:1" onclick="KnowPage.showHistory()">查看完整报告</button>
                </div>
                <button class="btn btn-ghost" style="width: 100%; margin-top: 12px;" onclick="KnowPage.render()">返回首页</button>
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
                    <span style="font-weight: 600; font-size: 18px;">问问暖知</span>
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
                    <button class="btn btn-primary chat-send" onclick="KnowPage.sendMessage()">发送</button>
                </div>
            </div>
        `;
        const msgs = document.getElementById('chatMessages');
        msgs.scrollTop = msgs.scrollHeight;
    },

    sendMessage() {
        const input = document.getElementById('chatInput');
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
                        <span style="font-weight: 600; font-size: 18px;">历史测试结果</span>
                        <span></span>
                    </div>
                    <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                        <p style="font-size: 48px; margin-bottom: 16px;">📋</p>
                        <p>还没有测评记录</p>
                        <p style="margin-top: 8px;">完成一次测评后，结果会显示在这里</p>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="page">
                <div class="chat-header">
                    <button class="btn-back" onclick="KnowPage.render()">← 返回</button>
                    <span style="font-weight: 600; font-size: 18px;">历史测试结果</span>
                    <span></span>
                </div>
                <div class="history-list">
                    ${history.map(h => {
                        const date = new Date(h.date);
                        const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
                        return `
                            <div class="card" style="margin-bottom: 12px;">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="font-weight: 600;">${dateStr}</span>
                                    <span style="font-size: 14px; color: var(--text-secondary);">${h.statusLabel}</span>
                                </div>
                                <div style="margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap;">
                                    ${h.topConcerns.map(c => `<span class="concern-tag">${c}</span>`).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
};
