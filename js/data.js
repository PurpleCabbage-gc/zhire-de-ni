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
    kuppermanIntro: {
        title: 'Kupperman 更年期症状评估',
        description: 'Kupperman改良评分是国际通用的更年期症状评估工具，它将更年期女性模糊的"难受"转化为可量化数据，有助于个人追踪症状变化，也为就医时与医生沟通提供客观参考。建议您按最近一个月的真实感受完成自测。',
        applicable: '适用人群：40-65岁女性，或出现月经不规律、疑似围绝经期症状者',
        privacy: '隐私保护：测试结果仅用于自我评估，提交后不关联个人信息',
        disclaimer: '本测试不能替代专业医疗诊断，但可作为有效沟通工具，便于医生快速了解您当下的状态。',
        retestNote: '日常自测建议间隔至少3个月；已有症状者建议间隔2个月；绝经后期（停经满一年）建议6-12个月测一次。'
    },

    kuppermanAgeRanges: [
        { id: 'age_1', label: '45岁及以下（包括45岁）' },
        { id: 'age_2', label: '46-50' },
        { id: 'age_3', label: '51-55' },
        { id: 'age_4', label: '56-60' },
        { id: 'age_5', label: '61-65' },
        { id: 'age_6', label: '65岁以上（不包括65岁）' }
    ],

    kuppermanMenstrualStatus: [
        { id: 'mens_1', label: '规律月经' },
        { id: 'mens_2', label: '月经不规律' },
        { id: 'mens_3', label: '停经（<12个月）' },
        { id: 'mens_4', label: '停经（≥12个月）' }
    ],

    kuppermanQuestions: [
        {
            id: 1,
            symptom: '潮热出汗',
            baseScore: 4,
            text: '近一个月内，您是否出现突然发热、面部或全身潮红并伴随出汗的情况？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔（<3次/天）' },
                { value: 2, label: '较频繁（3-9次/天）' },
                { value: 3, label: '非常频繁（≥10次/天）' }
            ]
        },
        {
            id: 2,
            symptom: '感觉障碍',
            baseScore: 2,
            text: '近一个月内，您是否有异常的身体感觉（如冷、热、疼痛、麻木或感觉丧失）？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔（与天气变化有关）' },
                { value: 2, label: '较频繁（经常出现，但不影响生活）' },
                { value: 3, label: '非常频繁（持续存在，严重影响日常生活）' }
            ]
        },
        {
            id: 3,
            symptom: '失眠',
            baseScore: 2,
            text: '近一个月内，您的睡眠质量如何？是否难以入睡或易醒？',
            degrees: [
                { value: 0, label: '无失眠，睡眠正常' },
                { value: 1, label: '偶尔失眠' },
                { value: 2, label: '经常失眠，需服安眠药才能缓解' },
                { value: 3, label: '严重失眠，影响工作和生活' }
            ]
        },
        {
            id: 4,
            symptom: '易激动',
            baseScore: 2,
            text: '近一个月内，您是否比以往更容易情绪激动或发脾气？',
            degrees: [
                { value: 0, label: '无，情绪稳定' },
                { value: 1, label: '偶尔激动' },
                { value: 2, label: '经常激动，但能自我控制' },
                { value: 3, label: '频繁激动，完全无法克制' }
            ]
        },
        {
            id: 5,
            symptom: '抑郁、疑心',
            baseScore: 1,
            text: '近一个月内，您是否感到情绪低落、沮丧或对他人产生不必要的怀疑？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔出现，能自我调节' },
                { value: 2, label: '经常出现，需自我控制' },
                { value: 3, label: '持续存在，甚至失去生活信心' }
            ]
        },
        {
            id: 6,
            symptom: '眩晕',
            baseScore: 1,
            text: '近一个月内，您是否有头晕或站立不稳的感觉？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔头晕' },
                { value: 2, label: '经常头晕，但不影响日常活动' },
                { value: 3, label: '频繁头晕，妨碍正常生活' }
            ]
        },
        {
            id: 7,
            symptom: '疲乏',
            baseScore: 1,
            text: '近一个月内，您是否感到异常疲劳或体力下降？',
            degrees: [
                { value: 0, label: '无，精力正常' },
                { value: 1, label: '偶尔疲劳（长时间工作后感到累，但休息后能恢复）' },
                { value: 2, label: '经常疲劳（如爬四楼需要中途休息，或完成后明显气喘）' },
                { value: 3, label: '持续疲劳，日常活动受限（轻微活动如散步、站立即感到极度疲劳）' }
            ]
        },
        {
            id: 8,
            symptom: '骨关节痛',
            baseScore: 1,
            text: '近一个月内，您是否有骨关节疼痛或僵硬的情况？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔疼痛' },
                { value: 2, label: '经常疼痛，但关节功能正常' },
                { value: 3, label: '持续疼痛，关节活动受限' }
            ]
        },
        {
            id: 9,
            symptom: '头痛',
            baseScore: 1,
            text: '近一个月内，您是否有头痛的情况？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔头痛，可忍受' },
                { value: 2, label: '经常头痛' },
                { value: 3, label: '严重头痛，需服药缓解' }
            ]
        },
        {
            id: 10,
            symptom: '心悸',
            baseScore: 1,
            text: '近一个月内，您是否有心跳加快、心慌或心脏不适感？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔心悸' },
                { value: 2, label: '经常心悸，但不影响生活' },
                { value: 3, label: '频繁心悸，需就医治疗' }
            ]
        },
        {
            id: 11,
            symptom: '皮肤蚁走感',
            baseScore: 1,
            text: '近一个月内，您是否有皮肤蚂蚁爬行般的异常感受？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔出现' },
                { value: 2, label: '经常出现，但可忍受' },
                { value: 3, label: '持续存在，需治疗' }
            ]
        },
        {
            id: 12,
            symptom: '性生活',
            baseScore: 1,
            text: '近一个月内，您的性欲或性生活体验是否有变化？',
            degrees: [
                { value: 0, label: '正常，无不适' },
                { value: 1, label: '性欲下降' },
                { value: 2, label: '性交疼痛' },
                { value: 3, label: '性欲丧失' }
            ]
        },
        {
            id: 13,
            symptom: '泌尿系感染',
            baseScore: 1,
            text: '近一年内，您是否有尿频、尿急或排尿疼痛等泌尿系统感染症状？',
            degrees: [
                { value: 0, label: '无' },
                { value: 1, label: '偶尔感染，可自愈（<3次/年）' },
                { value: 2, label: '较频繁（>3次/年）' },
                { value: 3, label: '非常频繁（>1次/月），需服药' }
            ]
        }
    ],

    calculateKuppermanScore(answers) {
        let totalScore = 0;
        const itemScores = [];
        answers.forEach(a => {
            const q = this.kuppermanQuestions.find(q => q.id === a.questionId);
            if (q) {
                const score = q.baseScore * a.value;
                totalScore += score;
                itemScores.push({
                    symptom: q.symptom,
                    baseScore: q.baseScore,
                    degree: a.value,
                    degreeLabel: q.degrees[a.value].label,
                    score: score
                });
            }
        });
        let severity;
        if (totalScore <= 14) severity = 'normal';
        else if (totalScore <= 20) severity = 'mild';
        else if (totalScore <= 35) severity = 'moderate';
        else severity = 'severe';
        return { totalScore, itemScores, severity };
    },

    generateKuppermanReport(result, basicInfo) {
        const { totalScore, itemScores, severity } = result;
        const severityLabels = {
            normal: '正常范围',
            mild: '轻度更年期症状表现',
            moderate: '中度更年期症状表现',
            severe: '重度更年期症状表现'
        };
        const severityLabel = severityLabels[severity];

        const highScoreItems = itemScores.filter(i => i.score >= 4);
        const occasionalItems = itemScores.filter(i => i.degree === 1);

        let reportHtml = '';
        reportHtml += `<p style="font-size: var(--font-body); line-height: 1.8; margin-bottom: 16px;">您的 <strong>Kupperman 评分结果为 ${totalScore} 分</strong>，属于<strong>${severityLabel}</strong>。以下是重点分析：</p>`;

        if (highScoreItems.length > 0) {
            reportHtml += `<h3 style="font-size: var(--font-caption); font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">主要症状表现（4分以上的项目）：</h3>`;
            highScoreItems.forEach((item, idx) => {
                reportHtml += `<p style="font-size: var(--font-body); margin-bottom: 4px; padding-left: 12px;">${idx + 1}. ${item.symptom}（得分：${item.score}分，${item.degreeLabel}）</p>`;
            });
            reportHtml += `<br>`;
        }

        if (occasionalItems.length > 0) {
            reportHtml += `<h3 style="font-size: var(--font-caption); font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">值得关注的细节：</h3>`;
            const names = occasionalItems.map(i => i.symptom).join('、');
            reportHtml += `<p style="font-size: var(--font-body); line-height: 1.8; padding-left: 12px;">您有 ${occasionalItems.length} 个项目选择了"偶尔出现"的症状，包括${names}。这些症状虽未达高频程度，但集体出现可能相互影响。</p>`;
            reportHtml += `<br>`;
        }

        reportHtml += `<h3 style="font-size: var(--font-caption); font-weight: 600; color: var(--text-secondary); margin-bottom: 8px;">专业建议：</h3>`;
        reportHtml += `<div style="padding-left: 8px;">`;
        reportHtml += `<p style="font-size: var(--font-body); font-weight: 600; margin-bottom: 4px;">1. 医疗干预方面</p>`;
        reportHtml += `<p style="font-size: var(--font-body); line-height: 1.8; margin-bottom: 12px; padding-left: 8px;">建议妇科或更年期门诊就诊评估。情绪管理可能需要专业指导，激素治疗需由医生评估后决定。</p>`;
        reportHtml += `<p style="font-size: var(--font-body); font-weight: 600; margin-bottom: 4px;">2. 自我管理要点</p>`;
        reportHtml += `<p style="font-size: var(--font-body); line-height: 1.8; padding-left: 8px;">`;
        reportHtml += `(a) 建立情绪日记，记录波动规律<br>`;
        reportHtml += `(b) 尝试正念呼吸练习，缓解情绪症状<br>`;
        reportHtml += `(c) 保持规律作息，预防失眠加重<br>`;
        reportHtml += `(d) 适当补充钙质和维生素D<br>`;
        reportHtml += `</p>`;
        reportHtml += `<p style="font-size: var(--font-body); font-weight: 600; margin-bottom: 4px; margin-top: 12px;">3. 监测重点</p>`;
        reportHtml += `<p style="font-size: var(--font-body); line-height: 1.8; padding-left: 8px;">`;
        reportHtml += `(a) 观察情绪失控发作频率是否增加<br>`;
        reportHtml += `(b) 留意其他偶尔症状是否转为频繁<br>`;
        reportHtml += `(c) 每三个月复测量表，进行动态评估<br>`;
        reportHtml += `</p>`;
        reportHtml += `</div>`;
        reportHtml += `<br>`;
        reportHtml += `<p style="font-size: var(--font-caption); color: var(--text-secondary); line-height: 1.6; padding: 12px; background: var(--yellow-soft); border-radius: 10px;">请注意，这些症状都是更年期常见表现，通过规范管理和适当调整，多数症状可以得到有效控制。如果出现情绪持续低落或失眠加重等情况，请及时就诊。</p>`;

        return {
            totalScore,
            severity,
            severityLabel,
            highScoreItems,
            occasionalItems,
            reportHtml
        };
    },

    symptomQuestions: [
        { id: 1, text: '👋 您在夜里睡觉时，有没有因为身上突然燥热或大量出汗而热醒，需要掀被子或者换衣服？', icon: '🌡️', field: 'hotFlash' },
        { id: 2, text: '🌙 最近一段时间，您入睡困难吗？或者半夜醒了之后就很难再睡着？', icon: '🌙', field: 'sleep' },
        { id: 3, text: '💭 您有没有觉得最近比较容易烦躁、心情低落，或者情绪起起伏伏的？', icon: '💭', field: 'mood' },
        { id: 4, text: '🍃 白天是不是经常觉得提不起精神、做什么都觉得累？', icon: '🍃', field: 'fatigue' },
        { id: 5, text: '🦴 肩膀、膝盖、手指这些地方有没有隐隐的酸痛或僵硬感？', icon: '🦴', field: 'pain' },
        { id: 6, text: '🧠 最近有没有容易忘事，或者觉得注意力不太容易集中？', icon: '🧠', field: 'memory' },
        { id: 7, text: '💫 这段时间对亲密关系的兴致是不是比之前低了？', icon: '💫', field: 'libido' },
        { id: 8, text: '💧 会不会出现咳嗽、打喷嚏或者大笑的时候，有点漏尿的情况？', icon: '💧', field: 'incontinence' }
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
