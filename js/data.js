const AppData = {
    getSettings() {
        const defaults = {
            fontSize: 'standard',
            largeIcons: false,
            reminderMorning: true,
            reminderEvening: true,
            voiceEnabled: false,
            userName: '姐姐'
        };
        const saved = localStorage.getItem('zr_settings');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    },

    saveSettings(settings) {
        localStorage.setItem('zr_settings', JSON.stringify(settings));
        this.applyFontSize(settings.fontSize);
    },

    applyFontSize(size) {
        const map = { small: '15px', standard: '18px', large: '20px', xlarge: '22px' };
        document.documentElement.style.setProperty('--font-size-base', map[size] || '18px');
    },

    getAssessmentHistory() {
        const data = localStorage.getItem('zr_assessments');
        return data ? JSON.parse(data) : [];
    },

    saveAssessment(result) {
        const history = this.getAssessmentHistory();
        history.unshift({ ...result, date: new Date().toISOString() });
        localStorage.setItem('zr_assessments', JSON.stringify(history));
    },

    getTodayRecord() {
        const today = new Date().toISOString().slice(0, 10);
        const data = localStorage.getItem('zr_records');
        const records = data ? JSON.parse(data) : {};
        return records[today] || null;
    },

    saveRecord(record) {
        const today = new Date().toISOString().slice(0, 10);
        const data = localStorage.getItem('zr_records');
        const records = data ? JSON.parse(data) : {};
        records[today] = { ...record, date: today };
        localStorage.setItem('zr_records', JSON.stringify(records));
    },

    getAllRecords() {
        const data = localStorage.getItem('zr_records');
        return data ? JSON.parse(data) : {};
    },

    getJournals() {
        const data = localStorage.getItem('zr_journals');
        return data ? JSON.parse(data) : {};
    },

    saveJournal(entry) {
        const today = new Date().toISOString().slice(0, 10);
        const data = localStorage.getItem('zr_journals');
        const journals = data ? JSON.parse(data) : {};
        journals[today] = { ...entry, date: today };
        localStorage.setItem('zr_journals', JSON.stringify(journals));
    },

    getBookmarks() {
        const data = localStorage.getItem('zr_bookmarks');
        return data ? JSON.parse(data) : this.defaultBookmarks();
    },

    defaultBookmarks() {
        return [
            { title: '潮热来了怎么办', content: '深呼吸，找阴凉处，喝温水。穿透气面料衣物，减少辛辣食物。' },
            { title: '睡不着的小妙招', content: '固定就寝时间，睡前1小时远离屏幕，尝试温水泡脚或腹式呼吸。' },
            { title: '情绪波动不是你的错', content: '激素变化会影响情绪调节。允许自己有情绪，试着做三次深呼吸。' }
        ];
    }
};

const MockData = {
    assessmentQuestions: [
        { id: 1, text: '最近是否经历过潮热或突然发热的感觉？', category: '潮热' },
        { id: 2, text: '夜间是否有盗汗影响睡眠的情况？', category: '盗汗' },
        { id: 3, text: '是否感觉入睡困难或容易早醒？', category: '睡眠' },
        { id: 4, text: '是否经常感到情绪波动或容易烦躁？', category: '情绪' },
        { id: 5, text: '是否感觉记忆力或注意力有所下降？', category: '记忆' },
        { id: 6, text: '是否经常感到疲劳或精力不足？', category: '疲劳' },
        { id: 7, text: '是否有关节或肌肉酸痛不适？', category: '关节' },
        { id: 8, text: '是否感觉皮肤变得干燥或敏感？', category: '皮肤' },
        { id: 9, text: '是否有心悸或心跳加速的感觉？', category: '心悸' },
        { id: 10, text: '是否感觉情绪低落或对事物兴趣减少？', category: '情绪' },
        { id: 11, text: '是否有头痛或头晕的情况？', category: '头痛' },
        { id: 12, text: '月经周期是否出现明显变化？', category: '月经' },
        { id: 13, text: '是否感觉体重有不明原因的变化？', category: '代谢' },
        { id: 14, text: '是否有尿频或漏尿的情况？', category: '泌尿' },
        { id: 15, text: '整体来说，这些变化是否影响了日常生活质量？', category: '综合' }
    ],

    assessmentOptions: [
        { label: '完全没有', value: 0 },
        { label: '轻微', value: 1 },
        { label: '中度', value: 2 },
        { label: '比较明显', value: 3 }
    ],

    symptomQuestions: [
        { id: 1, text: '潮热 / 盗汗', icon: '🌡️' },
        { id: 2, text: '睡眠障碍', icon: '🌙' },
        { id: 3, text: '情绪波动 / 焦虑', icon: '💭' },
        { id: 4, text: '疲劳乏力', icon: '🍃' },
        { id: 5, text: '关节肌肉痛', icon: '🦴' },
        { id: 6, text: '记忆力变化', icon: '🧠' },
        { id: 7, text: '性欲减退', icon: '💫' },
        { id: 8, text: '尿频 / 漏尿', icon: '💧' }
    ],

    severityLevels: [
        { label: '无', value: 0, color: '#A3C9A8' },
        { label: '极轻', value: 1, color: '#c8e0cb' },
        { label: '轻度', value: 2, color: '#f0d9a0' },
        { label: '中度', value: 3, color: '#F4C2A1' },
        { label: '重度', value: 4, color: '#e8a07a' }
    ],

    moods: [
        { label: '开心', emoji: '😊' },
        { label: '平静', emoji: '😌' },
        { label: '有点烦', emoji: '😤' },
        { label: '难过', emoji: '😢' },
        { label: '生气', emoji: '😠' },
        { label: '疲惫', emoji: '😴' }
    ],

    quickPhrases: [
        '我今天主动跟朋友聊了身体变化',
        '我尝试了深呼吸放松',
        '我今天散步了一会儿',
        '我给自己留了一段休息时间',
        '我准备找医生聊一聊',
        '我今天喝够了水',
        '我早睡了半小时'
    ],

    aiResponses: {
        greeting: [
            '今天身体感觉怎么样？有什么想聊的都可以告诉我。',
            '我在这里陪着你，有什么不舒服的地方吗？'
        ],
        hotFlash: '潮热是更年期最常见的信号之一，大约75%的女性都会经历。这是因为体内雌激素水平波动，影响了大脑的体温调节中枢。\n\n你可以尝试：\n• 穿透气的棉质衣物，方便随时增减\n• 随身带一把小风扇或湿巾\n• 减少辛辣食物和酒精\n• 睡前保持卧室凉爽\n\n⚠️ 仅供参考，不能替代医生诊断。如不适持续或加重，建议及时咨询专业医生。',
        sleep: '睡眠问题在这个阶段很常见，不是你一个人这样。激素变化会影响睡眠节律和质量。\n\n一些温和的改善方法：\n• 固定就寝时间，建立规律作息\n• 睡前1小时关闭电子屏幕\n• 尝试温水泡脚或简单的拉伸\n• 卧室保持安静、黑暗、凉爽\n\n⚠️ 仅供参考，不能替代医生诊断。如不适持续或加重，建议及时咨询专业医生。',
        emotion: '情绪波动是身体在适应激素变化的自然反应，不是你变得"脆弱"了。\n\n你可以：\n• 允许自己有情绪，不评判自己\n• 做三次深长呼吸，让身体松下来\n• 跟信任的人聊聊感受\n• 做一些让自己开心的小事\n\n⚠️ 仅供参考，不能替代医生诊断。如不适持续或加重，建议及时咨询专业医生。',
        default: '我听到了你的感受。身体在不同阶段会有不同的信号，这些变化都是正常的。\n\n建议你：\n• 先观察几天，看看这个感受的变化趋势\n• 记录下来，方便之后和医生沟通\n• 今天可以先做一个让自己舒服的小事\n\n⚠️ 仅供参考，不能替代医生诊断。如不适持续或加重，建议及时咨询专业医生。'
    },

    encouragements: [
        '你今天照顾了自己，这很重要。',
        '记录本身就是一种温柔的关注。',
        '辛苦了，今天的你做得很好。',
        '每一次记录，都是对自己的善意。',
        '感谢你愿意花时间关注自己的身体。'
    ],

    generateWeekData() {
        const records = AppData.getAllRecords();
        const week = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const rec = records[key];
            let score = 0;
            if (rec && rec.symptoms) {
                score = Object.values(rec.symptoms).reduce((a, b) => a + b, 0);
            }
            week.push({
                date: key,
                dayName: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
                dayNum: d.getDate(),
                score: score,
                record: rec
            });
        }
        return week;
    }
};
