export const quizData = {
  meta: {
    id: "jinyong-persona-v1",
    name: "金庸江湖人格测试题库",
    version: "1.0.0",
    questionCount: 24,
    dimensionOrder: ["A", "B", "C", "D", "E", "F", "G", "H"],
    resultOrder: ["A", "B", "C", "D", "E", "F", "G", "H"],
    recommendedTieBreakOrder: ["H", "G", "A", "B", "E", "D", "F", "C"],
    scoringRule:
      "每题选择一个选项，将该选项的 scores 累加到总分；最终取最高维度作为主结果。若并列，可按 recommendedTieBreakOrder 依次决胜。"
  },
  dimensions: {
    A: {
      name: "掌局",
      tagline: "先定方向，再带全局",
      description: "倾向从全局格局出发安排资源、节奏与人手。"
    },
    B: {
      name: "聚义",
      tagline: "先稳人心，再推事情",
      description: "重视关系与情绪管理，擅长缓冲冲突与凝聚共识。"
    },
    C: {
      name: "守心",
      tagline: "先守原则，再谈得失",
      description: "有较强的理想性和价值底线，不轻易为现实压力改口。"
    },
    D: {
      name: "破阵",
      tagline: "先动起来，再打穿僵局",
      description: "行动果断，偏好在高压环境中直接出手拿结果。"
    },
    E: {
      name: "隐忍",
      tagline: "先压情绪，再看时机",
      description: "更能沉住气，愿意延后表达和行动换取更稳的落点。"
    },
    F: {
      name: "守拙",
      tagline: "先划边界，再谈合作",
      description: "风险意识强，习惯预留后手，不轻易把底牌摊开。"
    },
    G: {
      name: "借势",
      tagline: "先借力，再省力赢",
      description: "擅长在规则、人情和时局之间找可转圜空间。"
    },
    H: {
      name: "洞察",
      tagline: "先看透，再定动作",
      description: "擅长观察细节、识别根因，重视判断质量。"
    }
  },
  resultProfiles: {
    A: {
      title: "掌门执局者",
      subtitle: "你更像那种一上来先把江湖盘面摆正的人",
      summary:
        "你天然会先看方向、资源和顺序。别人还在纠结局部时，你已经在想这件事的全局后果。",
      strengths: ["大局感强", "能扛总责", "擅长排兵布阵"],
      risks: ["容易显得强势", "可能忽略局部感受", "对低效率容忍度低"],
      advice: ["多留一点解释成本", "让关键执行者提前参与", "全局判断后也给局部试错空间"],
      sampleFigures: {
        male: ["乔峰", "郭靖", "张翠山"],
        female: ["黄蓉", "任盈盈", "王语嫣"]
      }
    },
    B: {
      title: "聚义安众者",
      subtitle: "你更像那种先稳住人心的人",
      summary:
        "你很会感知气氛和关系网络，知道什么时候该安抚、什么时候该给台阶。",
      strengths: ["共情力强", "善于协调", "容易赢得信任"],
      risks: ["可能过度顾全", "对冲突反应偏保守", "容易替别人承担情绪"],
      advice: ["安抚之后要及时落动作", "别把和气等同于妥协", "关键时刻要敢于定线"],
      sampleFigures: {
        male: ["令狐冲", "段誉", "张无忌"],
        female: ["小昭", "程灵素", "阿朱"]
      }
    },
    C: {
      title: "守心持节者",
      subtitle: "你更像那种不愿轻易改掉初心的人",
      summary:
        "你在意对错、名节和自我认同，宁可走得慢一点，也不愿为了眼前利益彻底变形。",
      strengths: ["原则感强", "立场稳定", "有精神感召力"],
      risks: ["可能显得理想化", "不易接受灰度方案", "会为失望付出较高情绪成本"],
      advice: ["守原则也要设计落地方式", "允许阶段性妥协但不改底线", "学会区分价值冲突和方法分歧"],
      sampleFigures: {
        male: ["萧峰", "杨过", "胡斐"],
        female: ["郭襄", "小龙女", "袁紫衣"]
      }
    },
    D: {
      title: "破阵开路者",
      subtitle: "你更像那种一有空档就直接冲进去的人",
      summary:
        "你的强项是推进力和魄力。局面越僵，你越容易被激发出行动欲。",
      strengths: ["执行果断", "抗压能力强", "擅长抢窗口"],
      risks: ["容易过快出手", "可能压缩他人节奏", "后续收口需要补课"],
      advice: ["先判断是否值得打", "留一个补救预案", "关键推进前确认共识边界"],
      sampleFigures: {
        male: ["杨过", "令狐冲", "韦小宝"],
        female: ["赵敏", "周芷若", "黄蓉"]
      }
    },
    E: {
      title: "隐忍衡势者",
      subtitle: "你更像那种不急着亮态度的人",
      summary:
        "你擅长忍耐、观察和延后反应，知道很多时候赢不靠快，而靠稳。",
      strengths: ["情绪稳", "耐心足", "对时机敏感"],
      risks: ["容易让人看不清立场", "可能错失主动权", "压抑过久会突然反弹"],
      advice: ["克制不等于沉默", "重要节点要主动表态", "把隐忍转成有计划的蓄力"],
      sampleFigures: {
        male: ["张无忌", "虚竹", "段誉"],
        female: ["小龙女", "任盈盈", "阿朱"]
      }
    },
    F: {
      title: "守拙设防者",
      subtitle: "你更像那种总会先留后手的人",
      summary:
        "你对风险、漏洞和人性的反复有天然警觉，不会因为一时热情就把门全打开。",
      strengths: ["边界清晰", "风险意识强", "善于止损"],
      risks: ["容易显得戒备重", "信任建立较慢", "可能压低合作效率"],
      advice: ["先设防也要给连接口", "别把谨慎变成封闭", "把规则写明比反复试探更省力"],
      sampleFigures: {
        male: ["郭靖", "张翠山", "胡斐"],
        female: ["灭绝师太", "李莫愁", "周芷若"]
      }
    },
    G: {
      title: "借势布局者",
      subtitle: "你更像那种知道怎么把力借出来的人",
      summary:
        "你对局势、人情和资源的可调度空间很敏感，往往能用更省力的路径实现目的。",
      strengths: ["策略感强", "善于变通", "擅长借力打力"],
      risks: ["容易被误解为圆滑", "过度设计会拖慢执行", "有时会想得太多做得太少"],
      advice: ["谋划之后要及时落地", "别让策略掩盖真实立场", "保留机动但别失掉可信度"],
      sampleFigures: {
        male: ["韦小宝", "欧阳锋", "岳不群"],
        female: ["黄蓉", "赵敏", "王语嫣"]
      }
    },
    H: {
      title: "察微断事者",
      subtitle: "你更像那种先把问题看透的人",
      summary:
        "你习惯在行动前先识别症结、动机和因果关系，所以你的判断通常带一点冷静的穿透力。",
      strengths: ["观察细", "判断稳", "能看到根因"],
      risks: ["容易显得慢热", "可能因追求准确而延迟动作", "对粗糙执行耐受较低"],
      advice: ["判断完成后要敢于落锤", "别让分析成为拖延", "把洞察翻译成别人听得懂的动作"],
      sampleFigures: {
        male: ["黄药师", "一灯大师", "风清扬"],
        female: ["王语嫣", "程灵素", "黄蓉"]
      }
    }
  },
  questions: [
    {
      id: 1,
      text: "你临时接手一件已快失控的项目，离截止只剩三天。你第一反应更像：",
      options: [
        { key: "A", text: "先把轻重缓急排出来，重新定顺序", scores: { A: 3 } },
        { key: "B", text: "先找核心成员逐个稳住情绪和预期", scores: { B: 3 } },
        { key: "C", text: "先砍掉不必要部分，直接推进最关键动作", scores: { D: 3 } },
        { key: "D", text: "先看问题到底卡在哪一环，再决定怎么救", scores: { H: 3 } }
      ]
    },
    {
      id: 2,
      text: "规则和人情撞在一起时，你通常会：",
      options: [
        { key: "A", text: "原则不破，但尽量给对方体面出口", scores: { B: 2, C: 1 } },
        { key: "B", text: "先守规则，任何例外都会留下后患", scores: { F: 2, C: 1 } },
        { key: "C", text: "看时机和关系重要程度，再决定尺度", scores: { G: 3 } },
        { key: "D", text: "先判断这条规则的本意，再看能否调整执行", scores: { H: 2, A: 1 } }
      ]
    },
    {
      id: 3,
      text: "有人在公开场合否定你的方案，而且理由并不充分。你更可能：",
      options: [
        { key: "A", text: "当场反驳，把逻辑一条条摆清楚", scores: { D: 2, A: 1 } },
        { key: "B", text: "先不正面冲突，记住对方顾虑再找机会谈", scores: { E: 2, G: 1 } },
        { key: "C", text: "先稳住场面，避免讨论变成情绪对撞", scores: { B: 2, E: 1 } },
        { key: "D", text: "先拆解对方真正反对的是内容还是立场", scores: { H: 3 } }
      ]
    },
    {
      id: 4,
      text: "你带的新人频繁出错，但态度一直很好。你更倾向于：",
      options: [
        { key: "A", text: "先手把手带一轮，让他先站稳", scores: { B: 3 } },
        { key: "B", text: "先把标准写清楚，错一条纠一条", scores: { F: 2, A: 1 } },
        { key: "C", text: "先放他去做，再从实战中修正", scores: { D: 2, G: 1 } },
        { key: "D", text: "先找出他总犯错的根因，再定培养方式", scores: { H: 2, E: 1 } }
      ]
    },
    {
      id: 5,
      text: "面对一个七成把握但收益很高的机会，你通常会：",
      options: [
        { key: "A", text: "先出手，占住先机再补细节", scores: { D: 3 } },
        { key: "B", text: "先做小范围试探，再决定是否放大", scores: { G: 2, F: 1 } },
        { key: "C", text: "先补证据，宁可慢一点也不要赌错", scores: { H: 2, E: 1 } },
        { key: "D", text: "先评估全局承压能力，再看值不值得押", scores: { A: 2, F: 1 } }
      ]
    },
    {
      id: 6,
      text: "你发现身边有人长期越界消耗你，你最像会：",
      options: [
        { key: "A", text: "直接摊开说清楚，从今天开始立线", scores: { F: 2, D: 1 } },
        { key: "B", text: "先降频接触，用行动表达边界", scores: { E: 2, F: 1 } },
        { key: "C", text: "先委婉提醒，给对方一次自我修正机会", scores: { B: 2, G: 1 } },
        { key: "D", text: "先想清楚自己为什么一直容忍，再决定怎么处理", scores: { H: 2, C: 1 } }
      ]
    },
    {
      id: 7,
      text: "你被临时推到台前主持大局，现场意见很乱。你第一步更可能：",
      options: [
        { key: "A", text: "先把议题收束成几个关键决策点", scores: { A: 3 } },
        { key: "B", text: "先让最焦躁的几方把话说出来，稳住气氛", scores: { B: 3 } },
        { key: "C", text: "先定谁拍板、谁执行，快速进入推进状态", scores: { D: 2, A: 1 } },
        { key: "D", text: "先判断各方真正的利益和顾虑分别是什么", scores: { H: 2, G: 1 } }
      ]
    },
    {
      id: 8,
      text: "别人用很高的情绪要求你立刻表态，你更常见的反应是：",
      options: [
        { key: "A", text: "不被带节奏，先把情绪压下来再谈", scores: { E: 3 } },
        { key: "B", text: "先接住情绪，再慢慢引回事情本身", scores: { B: 2, E: 1 } },
        { key: "C", text: "先追问关键事实，拒绝在信息不全时站队", scores: { H: 2, F: 1 } },
        { key: "D", text: "先给一个临时决定，避免局面继续发散", scores: { D: 2, A: 1 } }
      ]
    },
    {
      id: 9,
      text: "你最不喜欢哪种合作方式：",
      options: [
        { key: "A", text: "没人负责、事情全靠临场救火", scores: { A: 2, F: 1 } },
        { key: "B", text: "表面客气，实际互相消耗情绪", scores: { B: 2, H: 1 } },
        { key: "C", text: "嘴上说原则，落地时一退再退", scores: { C: 3 } },
        { key: "D", text: "想很多却迟迟不动，窗口都过去了", scores: { D: 3 } }
      ]
    },
    {
      id: 10,
      text: "如果必须在“效率”和“公平感”之间做平衡，你通常会：",
      options: [
        { key: "A", text: "优先效率，先把事情做成再修公平", scores: { D: 2, A: 1 } },
        { key: "B", text: "优先公平感，哪怕慢一点也更稳", scores: { C: 2, B: 1 } },
        { key: "C", text: "先设计一个大多数人能接受的折中方案", scores: { G: 2, A: 1 } },
        { key: "D", text: "先分情境判断，有些事根本不该一刀切", scores: { H: 3 } }
      ]
    },
    {
      id: 11,
      text: "你更容易被哪句话打动：",
      options: [
        { key: "A", text: "“这件事得有人站出来扛全责。”", scores: { A: 3 } },
        { key: "B", text: "“别让跟着你的人寒心。”", scores: { B: 3 } },
        { key: "C", text: "“有些底线不能因为现实就变。”", scores: { C: 3 } },
        { key: "D", text: "“别被表象骗了，先看清真正的局。”", scores: { H: 3 } }
      ]
    },
    {
      id: 12,
      text: "当你已经察觉某人不可靠时，你一般会：",
      options: [
        { key: "A", text: "减少关键交付给他，但表面不立刻翻脸", scores: { F: 2, E: 1 } },
        { key: "B", text: "继续观察，确认不是自己误判", scores: { H: 2, E: 1 } },
        { key: "C", text: "重新安排结构，不让整体被一个人拖垮", scores: { A: 2, F: 1 } },
        { key: "D", text: "尝试借他的优点，但避免深度绑定", scores: { G: 3 } }
      ]
    },
    {
      id: 13,
      text: "如果团队里出现两个同样能干但彼此不服的人，你更倾向于：",
      options: [
        { key: "A", text: "先分清权责边界，减少正面冲突空间", scores: { A: 2, F: 1 } },
        { key: "B", text: "先分别沟通，让他们都觉得被理解", scores: { B: 3 } },
        { key: "C", text: "让他们在具体结果上比一轮，谁行谁上", scores: { D: 2, C: 1 } },
        { key: "D", text: "先判断他们冲突的是利益、风格还是信任", scores: { H: 3 } }
      ]
    },
    {
      id: 14,
      text: "你做决定时最依赖的是：",
      options: [
        { key: "A", text: "这件事会不会影响整体格局", scores: { A: 3 } },
        { key: "B", text: "这会不会伤到最重要的人心", scores: { B: 3 } },
        { key: "C", text: "这是不是我认同的做法", scores: { C: 3 } },
        { key: "D", text: "这背后真正的因果是否已看清", scores: { H: 3 } }
      ]
    },
    {
      id: 15,
      text: "有个计划你已经筹备很久，却在最后一步被迫改方向。你会：",
      options: [
        { key: "A", text: "立刻改盘，优先保住核心目标", scores: { A: 2, D: 1 } },
        { key: "B", text: "先消化情绪，不让自己在气头上乱动", scores: { E: 3 } },
        { key: "C", text: "先看有没有借力转向的办法，别白费原积累", scores: { G: 3 } },
        { key: "D", text: "先复盘为什么会在最后一步出问题", scores: { H: 2, F: 1 } }
      ]
    },
    {
      id: 16,
      text: "别人评价你“太难看透”时，你心里更可能觉得：",
      options: [
        { key: "A", text: "看不透才安全，什么都摊开未必是好事", scores: { F: 3 } },
        { key: "B", text: "我只是没必要什么都立刻说出来", scores: { E: 3 } },
        { key: "C", text: "我是在看局，不是故意藏着掖着", scores: { H: 2, A: 1 } },
        { key: "D", text: "如果提前露牌，就借不到势了", scores: { G: 3 } }
      ]
    },
    {
      id: 17,
      text: "你更欣赏哪种赢法：",
      options: [
        { key: "A", text: "正面扛住压力，把局面硬生生推开", scores: { D: 3 } },
        { key: "B", text: "不伤太多人，还能把事情做成", scores: { B: 2, G: 1 } },
        { key: "C", text: "明面上不动声色，最后结果却早已布好", scores: { G: 2, E: 1 } },
        { key: "D", text: "提前看出风险，把败局化在发生前", scores: { H: 2, F: 1 } }
      ]
    },
    {
      id: 18,
      text: "如果你只能给后来者留下一条做事准则，你更愿意留下：",
      options: [
        { key: "A", text: "先定方向，再谈方法", scores: { A: 3 } },
        { key: "B", text: "先稳人心，很多事才推得动", scores: { B: 3 } },
        { key: "C", text: "先守住自己，别被局面带坏", scores: { C: 3 } },
        { key: "D", text: "先看本质，别急着被表象牵走", scores: { H: 3 } }
      ]
    },
    {
      id: 19,
      text: "面对复杂关系网时，你通常更像：",
      options: [
        { key: "A", text: "先分层分类，谁是关键谁是噪音", scores: { A: 2, H: 1 } },
        { key: "B", text: "先找最容易形成信任的连接点", scores: { B: 2, G: 1 } },
        { key: "C", text: "先确保自己不会被卷进去失掉边界", scores: { F: 3 } },
        { key: "D", text: "先看哪些关系其实可以互相借力", scores: { G: 3 } }
      ]
    },
    {
      id: 20,
      text: "你最难接受自己的哪种状态：",
      options: [
        { key: "A", text: "明知道方向不对，却还被局部拖着走", scores: { A: 3 } },
        { key: "B", text: "因为怕冲突，让重要的人失望", scores: { B: 2, C: 1 } },
        { key: "C", text: "为了眼前利益，说了自己并不认同的话", scores: { C: 3 } },
        { key: "D", text: "因为犹豫太久，错过该出手的时候", scores: { D: 3 } }
      ]
    },
    {
      id: 21,
      text: "当别人都在争一时输赢时，你更容易关注：",
      options: [
        { key: "A", text: "这件事之后的整体版图会不会变化", scores: { A: 2, G: 1 } },
        { key: "B", text: "这波情绪过去后，关系还能不能修复", scores: { B: 3 } },
        { key: "C", text: "有没有谁正在越过一条不该越的线", scores: { C: 2, F: 1 } },
        { key: "D", text: "表面争的是输赢，背后争的到底是什么", scores: { H: 3 } }
      ]
    },
    {
      id: 22,
      text: "你更像会怎么处理自己的野心：",
      options: [
        { key: "A", text: "把它转成明确目标和推进计划", scores: { A: 2, D: 1 } },
        { key: "B", text: "只在时机成熟时显露，不急着表态", scores: { E: 2, G: 1 } },
        { key: "C", text: "先问自己想赢成什么样，不想变成谁", scores: { C: 2, H: 1 } },
        { key: "D", text: "设好边界和后果，再决定要不要追", scores: { F: 2, H: 1 } }
      ]
    },
    {
      id: 23,
      text: "你最擅长的不是“赢一次”，而更像是：",
      options: [
        { key: "A", text: "把散乱的人和事编成一个能跑的系统", scores: { A: 3 } },
        { key: "B", text: "把快碎掉的关系重新缝起来", scores: { B: 3 } },
        { key: "C", text: "在混乱里守住自己的方向感", scores: { C: 2, E: 1 } },
        { key: "D", text: "在别人看不见的地方提前找到关键点", scores: { H: 2, G: 1 } }
      ]
    },
    {
      id: 24,
      text: "如果让你给自己选一句收尾，你更会选：",
      options: [
        { key: "A", text: "盘要稳，局才长。", scores: { A: 3 } },
        { key: "B", text: "人心在，路才不散。", scores: { B: 3 } },
        { key: "C", text: "有些事，值不值得比成不成更重要。", scores: { C: 3 } },
        { key: "D", text: "看透了，才知道该怎么赢。", scores: { H: 3 } }
      ]
    }
  ]
};
