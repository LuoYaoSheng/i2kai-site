// 站点元信息
export const siteMeta = {
  name: 'i2kai',
  title: '开发者 / 开源爱好者 / BLE & IoT 探索者',
  description: '开源项目、技术写作与工具构建',
  heroNote: '用真实项目记录 BLE、IoT 和桌面工具的开发旅程。',
};

// 个人信息
export const personalInfo = {
  name: 'LuoYaoSheng',
  alias: 'i2kai',
  bio: '独立开发者，专注于 BLE、IoT 和桌面工具开发。维护多个开源项目，相信「先体验，再看教程，再读源码」的学习方式。',
  location: '中国',
  roles: ['独立开发者', '开源维护者', 'BLE / IoT 探索者', '桌面工具构建者'],
};

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

// 项目列表
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
];

// 经历（占位）
export const experiences = [
  {
    period: '2024 — 至今',
    role: '独立开发者 & 开源维护者',
    description: '围绕 BLE、IoT 和桌面工具构建开源项目体系，维护 Smart BLE、Open IoT Platform 等核心项目。',
  },
  {
    period: '此前',
    role: '全栈开发',
    description: '积累跨端开发、服务端架构和产品工程经验。',
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
];

// 精选项目（首页用）
export const featuredProjects = [
  projectGroups[0].items[0],
  projectGroups[0].items[1],
  projectGroups[1].items[0],
];

// 文档站汇总（导航/链接用）
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
