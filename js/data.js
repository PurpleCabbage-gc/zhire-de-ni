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
        return history.length - 1;
    },

    getAssessmentById(index) {
        const history = this.getAssessmentHistory();
        return history[index] || null;
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

const KnowledgeBase = {
    faq: [
        { question: '围绝经期', answer: '指女性从卵巢功能开始衰退到绝经后1年的时期，通常发生在40-55岁之间，包括绝经前期、绝经期和绝经后早期。', keywords: ['围绝经期','什么是围绝经期','围绝经期是什么','定义','解释'] },
        { question: '更年期', answer: '指女性从生育期向老年期过渡的阶段，与围绝经期基本同义，是卵巢功能逐渐衰退的生理过程。', keywords: ['更年期','什么是更年期','更年期是什么'] },
        { question: '更年期综合征', answer: '指妇女在围绝经期由于性激素波动或减少导致的一系列躯体和精神心理症状，包括血管舒缩症状、泌尿生殖道症状、精神神经症状等。', keywords: ['更年期综合征','综合症','综合征'] },
        { question: '绝经', answer: '指月经永久性停止，通常定义为连续12个月无月经。我国女性平均绝经年龄约为49.5岁。', keywords: ['绝经','停经','月经停止','不来月经'] },
        { question: '雌激素', answer: '女性主要性激素，由卵巢分泌，在围绝经期水平下降，导致多种症状和健康问题。', keywords: ['雌激素','激素','荷尔蒙'] },
        { question: '激素替代治疗(HRT)', answer: '通过补充雌激素或雌孕激素来缓解绝经相关症状、预防骨质疏松的治疗方法，需在医生指导下使用。', keywords: ['HRT','激素替代','激素治疗','补充激素','激素疗法'] },
        { question: '潮热', answer: '围绝经期最常见的症状之一，表现为突然感到身体发热，伴有出汗、面部潮红，通常持续数分钟。', keywords: ['潮热','发热','脸热','身体发热','出汗'] },
        { question: '盗汗', answer: '夜间潮热引起的大量出汗，常导致睡眠中断，影响睡眠质量和生活质量。', keywords: ['盗汗','夜里出汗','睡觉出汗','晚上出汗'] },
        { question: '骨质疏松症', answer: '以骨量减少、骨组织微结构破坏为特征，导致骨脆性增加、易发生骨折的全身性骨病，是围绝经期女性的重要健康问题。', keywords: ['骨质疏松','骨密度','骨头','骨折'] },
        { question: '骨密度检测', answer: '通过双能X线吸收测定法(DXA)测量骨密度，用于评估骨质疏松风险和监测治疗效果。', keywords: ['骨密度检测','骨密度检查','测骨密度'] },
        { question: '围绝经期有哪些常见症状', answer: '常见症状包括：(1)血管舒缩症状：潮热、盗汗；(2)泌尿生殖道症状：阴道干涩、性欲下降、尿频尿急；(3)精神神经症状：情绪波动、焦虑抑郁、失眠、记忆力减退；(4)其他症状：关节肌肉疼痛、皮肤干燥、体重增加等。', keywords: ['症状','常见症状','有什么症状','表现','征兆','不舒服'] },
        { question: '潮热盗汗什么时候最严重', answer: '潮热通常在绝经前后1-2年最为严重，持续时间因人而异，平均持续2-3年，部分女性可能持续更长时间。症状频率和强度也各不相同。', keywords: ['潮热严重','盗汗严重','什么时候严重','最严重'] },
        { question: '为什么会出现情绪波动', answer: '雌激素水平波动和下降会影响大脑神经递质（如血清素）的分泌，导致情绪不稳定、焦虑、抑郁等症状。此外，潮热、失眠等症状也会间接影响情绪。', keywords: ['情绪波动','情绪不稳定','烦躁','心情不好','爱发脾气','为什么情绪'] },
        { question: '阴道干涩怎么办', answer: '可通过以下方法改善：(1)使用水基润滑剂；(2)保持规律性生活；(3)使用阴道雌激素制剂（需医生处方）；(4)避免使用刺激性洗液；(5)穿着透气棉质内衣。', keywords: ['阴道干涩','干涩','干','同房疼','性交痛'] },
        { question: '围绝经期为什么要重视营养管理', answer: '围绝经期女性因雌激素水平下降，面临骨质疏松、心血管疾病、体重增加、肌肉流失等多重健康风险。合理的营养管理可以改善症状、预防慢性疾病、提高生活质量、延缓衰老。', keywords: ['营养','吃什么','饮食','补充营养'] },
        { question: '围绝经期每天应该摄入多少钙', answer: '建议每日钙摄入量为1000-1200mg。可通过乳制品（牛奶、酸奶、奶酪）、豆制品、绿叶蔬菜（小白菜、芥蓝）、虾皮、芝麻等食物补充。食物摄入不足时可服用钙剂补充。', keywords: ['补钙','钙片','钙','喝牛奶','补钙吗'] },
        { question: '维生素D的推荐摄入量', answer: '建议每日摄入600-800IU（15-20μg）维生素D。可通过适度日晒（每天15-30分钟）、食用富含维生素D的食物（深海鱼、蛋黄、强化奶制品）或服用补充剂获取。', keywords: ['维生素D','维D','VD','晒太阳'] },
        { question: '为什么要增加蛋白质摄入', answer: '围绝经期女性容易出现肌肉流失（肌少症），充足的蛋白质有助于维持肌肉量、骨骼健康和免疫功能。建议每日摄入1.0-1.2g/kg体重的蛋白质，优先选择优质蛋白（鱼类、禽肉、豆类、蛋奶）。', keywords: ['蛋白质','蛋白','吃肉','鸡蛋','肌肉'] },
        { question: '大豆异黄酮有什么作用', answer: '大豆异黄酮是植物雌激素，结构类似人体雌激素，可以帮助缓解潮热、盗汗等症状，并可能有助于骨健康和心血管健康。建议每日摄入30-50mg大豆异黄酮（相当于50-100g豆制品）。', keywords: ['大豆异黄酮','豆制品','豆浆','豆腐','植物雌激素','蜂胶'] },
        { question: '应该避免哪些食物', answer: '建议减少：(1)高盐食物（腌制品、加工食品）；(2)高糖食物（甜点、含糖饮料）；(3)高饱和脂肪食物（肥肉、动物内脏、油炸食品）；(4)咖啡因和酒精（可能加重潮热和失眠）；(5)辛辣刺激食物（可能诱发潮热）。', keywords: ['忌口','不能吃','避免','少吃','不吃','饮食禁忌'] },
        { question: 'Omega-3脂肪酸为什么重要', answer: 'Omega-3脂肪酸具有抗炎作用，有助于心血管健康、改善情绪、缓解关节疼痛。建议每周食用2-3次深海鱼（三文鱼、沙丁鱼、鲭鱼）或补充鱼油。', keywords: ['鱼油','Omega','ω-3','深海鱼','不饱和脂肪酸'] },
        { question: '膳食纤维摄入建议', answer: '建议每日摄入25-30g膳食纤维。可通过全谷物、蔬菜、水果、豆类、坚果等食物获取。充足的纤维有助于控制体重、稳定血糖、改善便秘、降低心血管疾病风险。', keywords: ['膳食纤维','纤维素','粗粮','便秘','蔬菜水果'] },
        { question: '围绝经期推荐什么运动', answer: '推荐多样化运动组合：(1)有氧运动：快走、慢跑、游泳、骑自行车，每周150-300分钟中等强度或75-150分钟高强度；(2)力量训练：哑铃、弹力带训练，每周2-3次；(3)柔韧性训练：瑜伽、拉伸；(4)平衡训练：太极、单腿站立，预防跌倒。', keywords: ['运动','锻炼','健身','跑步','做什么运动','适合什么运动'] },
        { question: '运动对围绝经期有什么好处', answer: '运动可以：(1)缓解潮热、改善睡眠；(2)控制体重、减少腹部脂肪；(3)增强骨密度、预防骨质疏松；(4)改善心血管健康；(5)提升情绪、减轻焦虑抑郁；(6)增强肌肉力量和平衡能力；(7)提高生活质量。', keywords: ['运动好处','运动有什么好','为什么要运动'] },
        { question: '如何保证睡眠质量', answer: '建议：(1)保持规律作息，固定睡眠时间；(2)睡前2小时避免电子设备；(3)保持卧室凉爽、安静、黑暗；(4)避免睡前饮用咖啡因和酒精；(5)睡前进行放松活动（温水浴、冥想、阅读）；(6)白天适度运动但避免睡前剧烈运动；(7)持续失眠应就医评估。', keywords: ['睡眠','睡觉','失眠','睡不着','入睡','早醒','多梦'] },
        { question: '围绝经期可以吸烟喝酒吗', answer: '强烈建议戒烟和限制饮酒。吸烟会加重更年期症状、增加骨质疏松和心血管疾病风险、降低激素治疗效果、提前绝经年龄。过量饮酒会增加乳腺癌风险、影响骨健康、加重潮热。如饮酒，女性每日不超过1标准杯（约10g酒精）。', keywords: ['抽烟','吸烟','喝酒','饮酒','烟酒','能不能抽烟','能不能喝酒'] },
        { question: '为什么围绝经期容易发胖', answer: '主要原因包括：(1)雌激素下降导致基础代谢率降低；(2)脂肪分布改变，更容易在腹部堆积；(3)肌肉量减少，能量消耗降低；(4)活动量可能减少；(5)睡眠质量下降影响代谢。', keywords: ['发胖','胖了','长胖','体重增加','变胖','为什么胖'] },
        { question: '如何控制体重', answer: '综合策略：(1)饮食：控制总热量摄入，增加蛋白质和膳食纤维，减少精制碳水化合物和饱和脂肪；(2)运动：每周至少150分钟中等强度有氧运动+力量训练；(3)睡眠：保证7-8小时充足睡眠；(4)压力管理：减少情绪性进食；(5)监测：定期称重和体脂测量。', keywords: ['控制体重','减肥','减重','怎么瘦','瘦下来'] },
        { question: '腹部脂肪增加有什么健康风险', answer: '腹部（内脏）脂肪增加会显著增加心血管疾病、2型糖尿病、高血压、高血脂、脂肪肝等代谢性疾病的风险。腰围是简单的评估指标，中国女性建议腰围<80cm。', keywords: ['肚子胖','腹部','肚腩','腰围','内脏脂肪'] },
        { question: '如何应对情绪不稳定和焦虑', answer: '建议：(1)保持规律运动，促进内啡肽分泌；(2)充足睡眠，改善情绪调节能力；(3)均衡饮食，避免血糖波动；(4)学习放松技巧（深呼吸、冥想、正念）；(5)与家人朋友交流，寻求支持；(6)培养兴趣爱好，保持社交活动；(7)必要时寻求心理咨询或医疗帮助。', keywords: ['焦虑','紧张','担心','不安','心烦','心悸'] },
        { question: '围绝经期抑郁和普通抑郁有区别吗', answer: '围绝经期抑郁主要与激素波动有关，可能伴随潮热、睡眠障碍等更年期症状，激素治疗可能有效。但如果出现持续2周以上的情绪低落、兴趣丧失、无价值感等典型抑郁症状，应及时就医进行专业评估和治疗。', keywords: ['抑郁','抑郁症','沮丧','心情低落','不开心','没兴趣'] },
        { question: '如何保持积极心态', answer: '建议：(1)正确认识围绝经期是自然生理过程；(2)关注自己的优势和成就；(3)设定可实现的目标；(4)保持学习和成长；(5)维持社交联系；(6)帮助他人获得满足感；(7)实践感恩，记录积极事件；(8)接纳身体变化，关注内在价值。', keywords: ['心态','积极','乐观','怎么想开','正能量'] },
        { question: '围绝经期需要做哪些健康检查', answer: '建议定期检查：(1)妇科检查：宫颈癌筛查、盆腔超声，每年1次；(2)乳腺检查：乳腺超声或钼靶，每1-2年；(3)骨密度检测：50岁后或有骨折风险因素时；(4)心血管检查：血压、血脂、血糖，每年1次；(5)甲状腺功能；(6)肝肾功能；(7)必要时进行心电图、腹部超声等检查。', keywords: ['体检','检查','筛查','做什么检查','体检项目'] },
        { question: '什么情况下需要就医', answer: '以下情况应及时就医：(1)严重潮热影响日常生活；(2)持续失眠超过2周；(3)严重抑郁焦虑、有自伤倾向；(4)异常阴道出血；(5)骨折或骨折风险高；(6)血压血糖血脂异常；(7)自我管理措施无效；(8)需要评估是否适合激素治疗。', keywords: ['就医','看医生','去医院','看病','什么时候看医生'] },
        { question: '激素替代治疗(HRT)适合所有人吗', answer: '不适合。HRT禁忌症包括：(1)已知或怀疑乳腺癌；(2)已知或怀疑雌激素依赖性肿瘤（如子宫内膜癌）；(3)未明确诊断的阴道出血；(4)活动性静脉或动脉血栓栓塞性疾病；(5)严重肝肾功能障碍；(6)血卟啉症。使用HRT需医生评估利弊后个体化决定。', keywords: ['HRT适合','谁适合HRT','HRT禁忌','能用HRT吗'] },
        { question: 'HRT有什么风险', answer: '可能风险包括：(1)长期使用可能增加乳腺癌风险（尤其是雌孕激素联合治疗）；(2)静脉血栓风险轻度增加；(3)可能增加胆囊疾病风险；(4)子宫内膜癌风险（单用雌激素时，联合孕激素可降低风险）。但HRT的获益通常大于风险，需个体化评估。', keywords: ['HRT风险','HRT副作用','激素风险','激素副作用'] },
        { question: 'HRT需要用多久', answer: 'HRT使用时长应个体化决定。一般建议在最低有效剂量下使用，定期评估（每年至少1次）。缓解症状通常需要使用至症状缓解，预防骨质疏松可能需要更长时间。不建议常规长期使用，通常不超过5年，但可根据个体情况调整。', keywords: ['HRT用多久','激素用多久','要用多久','吃多久'] },
        { question: '非激素治疗有哪些选择', answer: '非激素治疗包括：(1)生活方式改善（饮食、运动、睡眠管理）；(2)植物雌激素（大豆异黄酮）；(3)选择性5-羟色胺再摄取抑制剂(SSRI)或5-羟色胺-去甲肾上腺素再摄取抑制剂(SNRI)，用于缓解潮热；(4)加巴喷丁，用于潮热；(5)认知行为疗法(CBT)；(6)针灸；(7)中医中药。', keywords: ['非激素','不用激素','不吃激素','其他方法','替代治疗'] },
        { question: '补钙会导致肾结石吗', answer: '适量补钙（每日不超过2000mg）一般不会增加肾结石风险。建议：(1)随餐服用钙剂，提高吸收率；(2)多饮水（每日1500-2000ml）；(3)避免过量补充维生素D；(4)限制高草酸食物（菠菜、浓茶）；(5)有肾结石病史者应咨询医生。', keywords: ['肾结石','结石','补钙结石','钙片结石'] },
        { question: '骨质疏松如何预防', answer: '综合预防措施：(1)充足钙摄入（1000-1200mg/天）；(2)充足维生素D（600-800IU/天）；(3)规律运动，尤其是负重运动和力量训练；(4)戒烟限酒；(5)避免过量咖啡因；(6)预防跌倒；(7)必要时使用抗骨质疏松药物（双膦酸盐、地舒单抗等）；(8)高风险者可考虑HRT。', keywords: ['预防骨质疏松','怎么预防','骨头健康'] },
        { question: '围绝经期性生活有什么变化', answer: '常见变化包括：(1)性欲下降；(2)阴道干涩，导致性交疼痛；(3)阴道壁变薄，更易受损；(4)性唤起时间延长；(5)性高潮强度可能降低。但这些变化可以通过适当措施改善。', keywords: ['性生活','同房','性欲','夫妻生活','房事'] },
        { question: '如何改善性生活质量', answer: '建议：(1)使用水基或硅基润滑剂；(2)延长前戏时间；(3)保持规律性生活，有助于维持阴道健康；(4)使用阴道雌激素制剂（需处方）；(5)凯格尔运动增强盆底肌；(6)与伴侣沟通需求和感受；(7)全身HRT对部分女性有效；(8)必要时咨询妇科医生或性治疗师。', keywords: ['改善性生活','性生活不好','提高性欲'] },
        { question: '家人如何支持围绝经期女性', answer: '家人可以：(1)学习了解围绝经期知识，理解症状；(2)给予情感支持和耐心；(3)帮助分担家务，减轻压力；(4)鼓励健康生活方式；(5)陪伴就医和健康检查；(6)尊重女性的感受和需求；(7)营造轻松和谐的家庭氛围；(8)避免批评和指责。', keywords: ['家人','家庭','老公','孩子','家人怎么帮'] },
        { question: '如何与伴侣沟通围绝经期问题', answer: '建议：(1)选择合适时机坦诚交流；(2)说明症状对自己的影响；(3)表达需求和期望；(4)邀请伴侣一起学习相关知识；(5)共同寻找应对策略；(6)表达对伴侣支持的感激；(7)讨论性生活变化和解决方案；(8)必要时共同咨询医生。', keywords: ['伴侣','老公','沟通','怎么说','告诉他'] }
    ],

    search(query) {
        if (!query || query.trim().length === 0) return null;
        const q = query.trim().toLowerCase();
        let bestMatch = null;
        let bestScore = 0;

        this.faq.forEach(item => {
            let score = 0;
            // Exact question match
            if (item.question.toLowerCase().includes(q) || q.includes(item.question.toLowerCase())) {
                score = 80;
            }
            // Keyword matching
            item.keywords.forEach(kw => {
                if (q.includes(kw.toLowerCase())) {
                    score = Math.max(score, 70);
                }
                // Partial keyword match
                if (kw.toLowerCase().includes(q) || q.includes(kw.toLowerCase())) {
                    score = Math.max(score, 60);
                }
            });
            // Word-by-word matching
            const queryWords = q.split(/[\s,，。！？、]+/).filter(w => w.length > 0);
            const matchCount = queryWords.filter(w => item.question.includes(w) || item.answer.includes(w)).length;
            if (queryWords.length > 0) {
                const wordScore = (matchCount / queryWords.length) * 50;
                score = Math.max(score, wordScore);
            }

            if (score > bestScore && score >= 30) {
                bestScore = score;
                bestMatch = { ...item, score };
            }
        });

        return bestMatch;
    }
};

const DeepSeekAPI = {
    apiKey: '',
    endpoint: 'https://api.deepseek.com/chat/completions',

    systemPrompt: `# Role
你是一位拥有 20 年妇科与更年期保健经验的女性全科医生，同时也是"炙热的你"健康 App 的温暖陪伴者。你善于倾听、充满同理心、语气柔软而坚定。

# Core Principles（核心原则）
1. **先安抚，再解释，再行动**：必须将情绪安抚放在最开头。
2. **通俗易懂**：优先使用生活化语言，医学术语必须紧跟"通俗大白话"解释。
3. **专业且温和**：给出明确、可操作的健康建议，但绝不制造恐慌。涉及就医提醒时，使用"需要留意"、"建议去医院看看更安心"等温和措辞。

# Output Structure（答案必须严格遵循以下四段结构输出）
用户在提问时，你需要注意按以下方式回答，不要输出额外的头尾寒暄，直接回答四段内容：

**第一部分：【先安抚】（50-80字）**
- 立刻回应用户的负面情绪（如"我懂你的难受"、"这种情况在围绝经期非常常见，你不是一个人"）。
- 共情并让她放下心理负担。

**第二部分：【可能原因】（100-150字）**
- 给出产生该症状的专业生理机制解释（简洁通俗）。
- *[必选] 紧接着附加一段【通俗大白话版本】*，去掉所有专业名词，用打比方或日常语言再重复解释一遍。

**第三部分：【现在可以试试】（100-150字）**
- 给出 2-3 个具体的、零门槛、居家可操作的建议（例如：深呼吸、调整饮食、简单拉伸等）。
- 行动必须具体，不能空泛（如"多休息"，要说"今晚提前 30 分钟放下手机，闭上眼听听白噪音"）。

**第四部分：【需要留意】（50字左右）**
- 列举需要警惕、建议去医院就医的征兆（如"胸痛、不明原因出血、严重心悸"）。
- 语气保持温和："如果出现以上这些情况，把它当作身体给你的提醒，去医院看一看，会更安心。"

# Constraints（限制条件）
- 严禁使用居高临下、说教的口吻。
- 禁止使用大段枯燥的医学临床论文句式。
- 在任何情况下都不要提及你是 AI 模型；你只是一位 App 里的资深陪伴医生。
- 必须保证答案拥有"治愈感"和"松弛感"。
- 回答字数控制在300-500字以内。`,

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('zr_ds_api_key', key);
    },

    getApiKey() {
        if (!this.apiKey) {
            this.apiKey = localStorage.getItem('zr_ds_api_key') || '';
        }
        return this.apiKey;
    },

    async chat(userMessage) {
        const key = this.getApiKey();
        if (!key) {
            return { success: false, error: 'no_key', message: '请先设置 DeepSeek API Key' };
        }

        try {
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: this.systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    temperature: 0.7,
                    max_tokens: 800
                })
            });

            if (!response.ok) {
                const err = await response.text();
                return { success: false, error: 'api_error', message: `API 请求失败: ${response.status}` };
            }

            const data = await response.json();
            const answer = data.choices[0].message.content;
            return { success: true, answer };
        } catch (e) {
            return { success: false, error: 'network', message: '网络连接失败，请检查网络后重试' };
        }
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
