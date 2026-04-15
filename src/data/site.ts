// 站点元信息
export const siteMeta = {
  name: 'i2kai',
  title: '物联网架构专家 / 全栈开发者 / 开源爱好者',
  description: '12年+全栈技术开发与管理经验，专注于物联网、智慧城市和开源项目。',
  heroNote: '用真实项目记录 BLE、IoT 和桌面工具的开发旅程。',
};

// SEO 元数据常量
export const seoMeta = {
  siteUrl: 'https://i2kai.com',
  siteName: 'i2kai',
  author: '罗耀生',
  keywords: 'i2kai, 罗耀生, 物联网架构, 智慧城市, 独立开发者, 开源项目, BLE, IoT, 桌面工具, Smart BLE, RedisPilot',
  themeColor: '#9f2f16',
  ogImage: '/favicon.svg',
};

// 个人信息
export const personalInfo = {
  name: '罗耀生',
  alias: 'i2kai',
  title: '物联网架构专家 / 全栈开发者',
  bio: '12年+全栈技术开发与管理经验。专注于物联网技术架构、智慧城市解决方案和分布式系统开发，致力于用技术创新解决实际问题。',
  tagline: '先体验，再学习，再读源码',
  location: '福建泉州',
  wechatPublic: '极客第一行',
  wechatPublic2: '待补充（第二个公众号名称）',
  highlights: [
    { label: '年行业经验', value: '12+' },
    { label: '完成项目', value: '50+' },
    { label: '合作客户', value: '20+' },
  ],
  roles: ['物联网架构专家', '全栈开发者', '开源维护者', 'BLE / IoT 探索者'],
};

// 教育背景
export const education = {
  school: '福建理工大学',
  schoolLogo: 'https://static-data.gaokao.cn/upload/logo/474.jpg',
  major: '电子信息工程',
  degree: '学士学位',
  period: '2008 - 2012',
};

// 开发哲学
export const philosophy = [
  {
    title: '先体验',
    description: '先跑起来、先扫码、先用工具。感受问题比理解原理更先一步。',
  },
  {
    title: '再学习',
    description: '带着真实体验去看文档、教程和协议，学习才有锚点。',
  },
  {
    title: '最后读源码',
    description: '知道了要解决什么问题之后，再读源码，比直接啃仓库高效得多。',
  },
];

// 工作经历
export const experiences = [
  {
    period: '2020.11 — 2024.06',
    role: '技术总监 — 福建省泉州华云软件有限公司',
    description: '组建 30 人技术团队，完成智慧消防系统架构设计，实现用电/烟雾/液位监控准确率 99.2%。主导智慧校园平台开发，集成门禁考勤、能耗管理等 8 大模块，落地 12 所学校。',
    highlights: ['30人团队', '99.2%准确率', '12所学校'],
  },
  {
    period: '2019.11 — 2020.10',
    role: '技术经理 — 厦门华方软件科技有限公司',
    description: '搭建路边智慧停车平台，日均处理 10万+ 订单，营收提升 200%。重构物联网通信协议，降低设备掉线率至 0.3%（行业平均 2.5%）。',
    highlights: ['10万+日订单', '营收提升200%', '掉线率0.3%'],
  },
  {
    period: '2015.09 — 2018.09',
    role: '技术总监 & 分公司总经理 — 北京易家信息',
    description: '从 0 到 1 搭建直播电商平台，峰值并发 50万+，获阿里战略投资。研发可视化物联网系统，实现 10万+ 设备实时监控。',
    highlights: ['50万+并发', '阿里投资', '10万+设备'],
  },
  {
    period: '2012.07 — 2013.09',
    role: '高级程序员 — KTV 智能点单系统',
    description: '重构核心订单模块，QPS 从 200 提升至 1500+，支撑全国 500+ 门店。首创"摇一摇点歌"功能，用户活跃度提升 120%。',
    highlights: ['QPS 1500+', '500+门店', '活跃度+120%'],
  },
];

// 专业技能
export const skills = {
  core: [
    { name: 'Go', level: 95 },
    { name: 'PHP', level: 90 },
    { name: 'Java', level: 85 },
    { name: 'MySQL / PostgreSQL', level: 90 },
    { name: 'Docker / K8S', level: 85 },
  ],
  domains: [
    { name: '物联网架构', level: 95 },
    { name: '智慧城市', level: 90 },
    { name: '分布式系统', level: 95 },
    { name: '团队建设', level: 90 },
  ],
  extras: ['React Native', 'ESP32/STM32', 'JavaScript', 'Spring Cloud', 'InfluxDB', 'Flutter', 'Tauri', 'BLE'],
};

// 成长时间线
export const timeline = [
  {
    year: '2024',
    title: '独立开发 & 开源',
    description: '围绕 BLE、IoT 和桌面工具构建开源项目体系，启动 Smart BLE 和 Open IoT Platform。',
  },
  {
    year: '2020',
    title: '技术总监',
    description: '组建团队，主导智慧消防和智慧校园平台，深耕物联网架构和智慧城市。',
  },
  {
    year: '2015',
    title: '创业 & 直播电商',
    description: '从零搭建直播电商平台，获阿里战略投资，探索高并发分布式系统。',
  },
  {
    year: '2012',
    title: '全栈开发起步',
    description: '福建理工大学毕业，电子信息工程专业，开始全栈开发之路。',
  },
];

// 精选项目（首页只展示代表作）
export const featuredProjects = [
  {
    name: 'Smart BLE',
    id: 'smart-ble',
    status: '主入口',
    summary: '跨平台 BLE 调试工具。微信小程序可扫码直接体验，是理解 BLE 协议和多平台实现差异的最佳入口。',
    repo: 'https://gitee.com/luoyaosheng/lys-smart-ble',
    github: 'https://github.com/LuoYaoSheng/smart-ble',
    docs: 'https://lightble.i2kai.com',
    tags: ['BLE', 'IoT', '小程序', '跨平台'],
  },
  {
    name: 'Open IoT Platform',
    id: 'open-iot-platform',
    status: '主入口',
    summary: '从设备接入、BLE 配网到 MQTT 控制的完整 IoT 平台。ESP32 固件 + Go 服务端 + Flutter APP 全链路。',
    repo: 'https://gitee.com/luoyaosheng/lys-iot-platform',
    github: 'https://github.com/LuoYaoSheng/lys-iot-platform',
    docs: 'https://iot.open.i2kai.com',
    tags: ['IoT', 'MQTT', 'BLE配网', '全栈'],
  },
  {
    name: 'RedisPilot',
    id: 'redispilot',
    status: '公开中',
    summary: '本地优先的 Redis 桌面管理工具。基于 Tauri 构建，轻量、快速。',
    repo: 'https://gitee.com/luoyaosheng/lys-redis-pilot',
    github: 'https://github.com/LuoYaoSheng/lys-redis-pilot',
    docs: 'https://redis.open.i2kai.com',
    tags: ['Redis', '桌面工具', 'Tauri'],
  },
];

// 技能领域
export const skillAreas = [
  {
    title: 'BLE & IoT',
    description: '跨平台 BLE 调试、设备配网、MQTT 通信、固件协作',
  },
  {
    title: '桌面工具',
    description: 'Redis 管理、数据库客户端、SSH 运维工作台',
  },
  {
    title: '移动开发',
    description: '微信小程序、跨平台移动应用',
  },
  {
    title: '全栈工程',
    description: '服务端、前端、数据库、DevOps',
  },
];

// 项目列表（完整数据，projects 页使用）
export const projectGroups = [
  {
    title: '核心主线',
    intro: 'BLE 与 IoT 学习的核心入口项目。',
    items: [
      {
        name: 'Smart BLE',
        id: 'smart-ble',
        status: '主入口',
        summary: '跨平台 BLE 调试工具，多分支多模式的实践样板。',
        repo: 'https://gitee.com/luoyaosheng/lys-smart-ble',
        github: 'https://github.com/LuoYaoSheng/smart-ble',
        docs: 'https://lightble.i2kai.com',
        tags: ['BLE', 'IoT', '小程序', '跨平台'],
      },
      {
        name: 'Open IoT Platform',
        id: 'open-iot-platform',
        status: '主入口',
        summary: '从设备接入、配网到控制管理的一体化 IoT 平台主系统。',
        repo: 'https://gitee.com/luoyaosheng/lys-iot-platform',
        github: 'https://github.com/LuoYaoSheng/lys-iot-platform',
        docs: 'https://iot.open.i2kai.com',
        tags: ['IoT', 'MQTT', 'BLE配网', '全栈'],
      },
      {
        name: 'SerialTool',
        id: 'serial-tool',
        status: '开发中',
        summary: '串口调试工具，补齐 IoT 硬件开发链路里的基础能力。',
        repo: 'https://gitee.com/luoyaosheng/lys-serial-tool',
        tags: ['串口', 'IoT', '硬件'],
      },
    ],
  },
  {
    title: '支撑工具',
    intro: '独立使用的桌面工具箱，从不同角度展示真实工程实践。',
    items: [
      {
        name: 'RedisPilot',
        id: 'redispilot',
        status: '公开中',
        summary: '本地优先 Redis 桌面管理工具。',
        repo: 'https://gitee.com/luoyaosheng/lys-redis-pilot',
        github: 'https://github.com/LuoYaoSheng/lys-redis-pilot',
        docs: 'https://redis.open.i2kai.com',
        tags: ['Redis', '桌面工具', 'Tauri'],
      },
      {
        name: 'QueryLab',
        id: 'querylab',
        status: '公开中',
        summary: '本地优先数据库客户端，聚焦 MySQL / MariaDB。',
        repo: 'https://gitee.com/luoyaosheng/lys-query-lab',
        github: 'https://github.com/LuoYaoSheng/lys-query-lab',
        docs: 'https://query.open.i2kai.com',
        tags: ['MySQL', '数据库', '桌面工具', 'Tauri'],
      },
      {
        name: 'TermForge',
        id: 'termforge',
        status: '公开中',
        summary: '跨平台 SSH / SFTP / Runbook 运维工作台。',
        repo: 'https://gitee.com/luoyaosheng/lys-term-forge',
        github: 'https://github.com/LuoYaoSheng/lys-term-forge',
        docs: 'https://term.open.i2kai.com',
        tags: ['SSH', '运维', '桌面工具', 'Tauri'],
      },
      {
        name: 'MCP DB Gateway',
        id: 'db-gateway',
        status: '公开中',
        summary: '数据库网关服务，服务于更安全的数据库访问链路。',
        repo: 'https://gitee.com/luoyaosheng/lys-db-gateway',
        tags: ['数据库', '网关', '安全'],
      },
    ],
  },
  {
    title: '创作与效率工具',
    intro: '写作、发布和资产生产工具。',
    items: [
      {
        name: 'PaperMD',
        id: 'papermd',
        status: '公开中',
        summary: '原生 macOS Markdown 编辑器，强调极致输入体验。',
        repo: 'https://gitee.com/luoyaosheng/lys-paper-md',
        github: 'https://github.com/LuoYaoSheng/lys-paper-md',
        docs: 'https://paper.open.i2kai.com',
        tags: ['macOS', 'Markdown', '编辑器'],
      },
      {
        name: 'Batch Image Studio',
        id: 'image-studio',
        status: '公开中',
        summary: 'AI 驱动的图片批量处理工具，用于项目素材与发布图生产。',
        repo: 'https://gitee.com/luoyaosheng/lys-image-studio',
        github: 'https://github.com/LuoYaoSheng/batch-image-studio',
        docs: 'https://batch.open.i2kai.com',
        tags: ['图片处理', 'AI', '桌面工具'],
      },
      {
        name: 'CodexSwitch',
        id: 'codex-switch',
        status: '公开中',
        summary: '跨平台代码/配置切换工具，灵活的 Profile 切换与 Provider 扩展机制。',
        repo: 'https://gitee.com/luoyaosheng/lys-codex-switch',
        github: 'https://github.com/LuoYaoSheng/lys-codex-switch',
        docs: 'https://codex.open.i2kai.com',
        tags: ['配置管理', '跨平台', '桌面工具'],
      },
      {
        name: 'Icon Gen',
        id: 'icon-gen',
        status: '公开中',
        summary: '图标生成工具，服务项目资产生成。',
        repo: 'https://gitee.com/luoyaosheng/lys-icon-gen',
        tags: ['图标', '资产生成'],
      },
    ],
  },
  {
    title: '企业级项目',
    intro: '主导过的智慧城市与物联网企业级项目。',
    items: [
      {
        name: '智慧消防物联网平台',
        id: 'smart-fire',
        status: '企业项目',
        summary: '面向大型商业综合体和工业园区的智慧消防解决方案，实现消防设备全连接、实时监控和智能预警。落地 23 个工业园区，年度火情下降 65%。',
        tags: ['物联网', '微服务', 'Go', '智慧城市'],
      },
      {
        name: '智慧校园管理系统',
        id: 'smart-campus',
        status: '企业项目',
        summary: '为学校提供一站式智慧校园解决方案，集成考勤、安防、消防、能耗监控等 8 大模块，落地 12 所学校。',
        tags: ['Java', 'Spring Boot', 'React Native', '智慧城市'],
      },
      {
        name: '智慧停车管理系统',
        id: 'smart-parking',
        status: '企业项目',
        summary: '基于计算机视觉和物联网技术的智能停车解决方案，支持车位检测、车牌识别、自动收费，日均处理 10万+ 订单。',
        tags: ['Python', 'TensorFlow', 'OpenCV', '物联网'],
      },
    ],
  },
  {
    title: '其他个人项目',
    intro: '更多个人开发的产品和应用。',
    items: [
      {
        name: '萌猫圈',
        id: 'mengmaoquan',
        status: '已上线',
        summary: '治愈系萌宠图片分享应用，汇集海量精选萌宠图片，支持收藏分享、关注作者等功能。',
        repo: 'https://cat.i2kai.com',
        tags: ['uniapp', 'Go', 'Vue3', '社交应用'],
      },
      {
        name: 'IconSize',
        id: 'iconsize',
        status: '已上线',
        summary: '快速批量生成图标的桌面工具，支持安卓、iOS、Mac、Windows 等平台图标的生成。',
        tags: ['Electron', 'JavaScript', '桌面开发'],
      },
    ],
  },
];

// 联系方式
export const contacts = [
  {
    label: 'GitHub',
    value: 'LuoYaoSheng',
    href: 'https://github.com/LuoYaoSheng',
  },
  {
    label: 'Gitee',
    value: 'luoyaosheng',
    href: 'https://gitee.com/luoyaosheng',
  },
  {
    label: 'Email',
    value: 'i2kai@foxmail.com',
    href: 'mailto:i2kai@foxmail.com',
  },
  {
    label: '公众号',
    value: '极客第一行',
    href: '/contact',
  },
];

// 文档站汇总
export const docSites = [
  { name: 'Smart BLE', url: 'https://lightble.i2kai.com' },
  { name: 'Open IoT Platform', url: 'https://iot.open.i2kai.com' },
  { name: 'RedisPilot', url: 'https://redis.open.i2kai.com' },
  { name: 'QueryLab', url: 'https://query.open.i2kai.com' },
  { name: 'TermForge', url: 'https://term.open.i2kai.com' },
  { name: 'PaperMD', url: 'https://paper.open.i2kai.com' },
  { name: 'Batch Image Studio', url: 'https://batch.open.i2kai.com' },
  { name: 'CodexSwitch', url: 'https://codex.open.i2kai.com' },
];
