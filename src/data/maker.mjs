// Optional metadata over the existing showcase. Missing evidence never enables an action.
export const series = [
  {
    id: 'dorm-upgrade', title: '改造宿舍', label: '生活改造', number: '01',
    summary: '从工作台、收纳到旧手机再利用，让有限的空间更适合生活与创作。',
    note: '长期栏目准备中。实拍、制作记录与各期视频将在确认后加入。',
    projectIds: [],
  },
  {
    id: 'fun-builds', title: '做点有趣的东西', label: '原创制作', number: '02',
    summary: '从一个小想法出发，探索可以自己动手、自由修改的软硬件作品。',
    note: '已收录离线叫号器、模块化机器人和桌面天气站。各档案记录当前原型与待验证项目。',
    projectIds: ['queue-caller', 'modular-ai-robot-kit', 'esp32-c3-weather-station'],
  },
  {
    id: 'open-experiments', title: '开源实验与复现', label: '开放分享', number: '03',
    summary: '从 BLE 调试到设备联动，沿着源码、文档和真实问题继续探索。',
    note: '已有项目档案与开发笔记；具体平台和发布状态以各项目说明为准。',
    projectIds: ['smart-ble', 'open-iot-platform', 'batch-image-studio'],
  },
];

export const projectDetails = {
  'queue-caller': {
    status: 'prototype', statusLabel: '样机研发中',
    openResources: { state: 'published', url: 'https://github.com/LuoYaoSheng/queue-caller', license: 'MIT（代码） / CERN-OHL-P v2（原创硬件与3D） / CC BY 4.0（原创文档）', note: '离线基础版源码已在GitHub与Gitee公开；V1为影片版本，V2/V3新版3D已单独标注。第三方和实物资格按各版说明。' },
  },
  'modular-ai-robot-kit': {
    status: 'prototype', statusLabel: '纸盒首样准备中',
    openResources: { state: 'not_published', note: '纸样、结构文件和电路资料待实物验证与发布审核。' },
  },
  'esp32-c3-weather-station': {
    status: 'provisional', statusLabel: 'PROVISIONAL / HOLD',
    openResources: {
      state: 'not_published',
      license: 'MIT',
      note: 'MIT 仅适用于项目原创代码与原创说明。第三方依赖、字库、证书和天气服务数据各有适用条款。复刻与制造资料待审核。',
    },
  },
  'smart-ble': {
    status: 'testing', statusLabel: '开发预览', verifiedAt: '2026-11-25',
    imageNote: '历史界面截图 · 当前版本见项目文档',
    notice: '微信小程序目标已于 2026-09-11 退役。当前可查看开发预览和源码构建指引；正式安装包与商店分发准备中。',
    openResources: {
      state: 'published', url: 'https://github.com/LuoYaoSheng/smart-ble', license: 'MIT',
      note: '公开软件与 ESP32 示例。各平台能力、构建和测试边界见原仓库；不代表所有硬件资料都已齐全。',
    },
  },
  'open-iot-platform': {
    imageNote: '原站项目图标',
    openResources: {
      state: 'published', url: 'https://github.com/LuoYaoSheng/open-iot-platform', license: 'GPL-3.0',
      note: '源码和文档供学习与联调。目前没有完整的 Web 管理后台。',
    },
  },
  'batch-image-studio': { imageNote: '原站应用界面' },
  'codex-switch': { status: 'archived', statusLabel: '暂停维护', imageNote: '原站项目图标' },
};

export function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch { return false; }
}

export function canSelfBuild(resources) {
  return ['published', 'partial'].includes(resources?.state)
    && isHttpsUrl(resources?.url)
    && Boolean(resources?.license?.trim());
}

export function canPurchase(sku) {
  return sku?.state === 'in_stock'
    && isHttpsUrl(sku?.productUrl)
    && typeof sku?.price === 'number' && Number.isFinite(sku.price) && sku.price > 0
    && typeof sku?.currency === 'string' && /^[A-Z]{3}$/.test(sku.currency)
    && sku?.verified === true
    && Boolean(sku?.verificationEvidence?.trim())
    && Boolean(sku?.version?.trim()) && Boolean(sku?.supportInfo?.trim());
}

export function getProjectDetails(slug) {
  const detail = projectDetails[slug] || {};
  return {
    status: 'unknown', statusLabel: '项目档案',
    seriesIds: series.filter((item) => item.projectIds.includes(slug)).map((item) => item.id),
    openResources: { state: 'unknown', note: '复刻资料、文件许可与实测成本尚未核实。已有项目入口见下方原始档案。' },
    ...detail,
    participation: {
      kit: { state: 'not_available' }, assembled: { state: 'not_available' },
      ...detail.participation,
    },
  };
}
