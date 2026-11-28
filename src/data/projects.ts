import { projectShowcaseCases } from './site';
import { getProjectDetails } from './maker.mjs';

type Project = typeof projectShowcaseCases[number];
export const projectTypes = ['Software', 'Hardware', 'IoT', 'AI', 'Tools', 'DIY', 'Experiments'] as const;
type ProjectType = typeof projectTypes[number];
type Stage = 'Active' | 'Development' | 'Preview' | 'Prototype' | 'Archived';

const metadata: Record<string, { types: ProjectType[]; stage: Stage; license?: string; release?: string; releaseUrl?: string; download?: string; thumbnail?: string }> = {
  'smart-ble': { types: ['Software', 'IoT', 'Tools'], stage: 'Preview', thumbnail: '/images/site/smart-ble-96.webp' },
  'open-iot-platform': {
    types: ['IoT', 'Software'], stage: 'Development', thumbnail: '/projects/open-iot-platform/app-icon.png', release: 'v0.3.0',
    releaseUrl: 'https://github.com/LuoYaoSheng/open-iot-platform/releases/tag/v0.3.0',
    download: 'https://github.com/LuoYaoSheng/open-iot-platform/releases/download/v0.3.0/open-iot-platform-v0.3.0.zip',
  },
  'queue-caller': { types: ['Hardware', 'DIY'], stage: 'Prototype' },
  'esp32-c3-weather-station': { types: ['IoT', 'Hardware', 'DIY', 'Experiments'], stage: 'Prototype' },
  'modular-ai-robot-kit': { types: ['AI', 'Hardware', 'DIY', 'Experiments'], stage: 'Prototype' },
  'batch-image-studio': {
    types: ['Software', 'Tools', 'AI'], stage: 'Active', release: 'v0.1.2',
    releaseUrl: 'https://github.com/LuoYaoSheng/batch-image-studio/releases/tag/v0.1.2',
    download: 'https://github.com/LuoYaoSheng/batch-image-studio/releases/tag/v0.1.2#assets',
  },
  redispilot: { types: ['Software', 'Tools'], stage: 'Development' },
  querylab: { types: ['Software', 'Tools'], stage: 'Development' },
  termforge: { types: ['Software', 'Tools'], stage: 'Development', license: 'MIT' },
  papermd: { types: ['Software', 'Tools'], stage: 'Development' },
  'codex-switch': { types: ['AI', 'Software', 'Tools'], stage: 'Archived', license: 'MIT' },
  'apps-progress': { types: ['Software'], stage: 'Active', license: 'MIT' },
  'open-source-site': { types: ['Software'], stage: 'Active' },
  'lianlian-jueding': { types: ['Software'], stage: 'Active', release: 'v1.0.0（微信小程序）' },
  iconsize: { types: ['Software', 'Tools'], stage: 'Development' },
  mengmaoquan: { types: ['Software'], stage: 'Archived' },
  'modbus-monitor': { types: ['IoT', 'Software', 'Tools'], stage: 'Archived' },
  'smart-fire-platform': { types: ['IoT', 'Software'], stage: 'Archived' },
  'smart-campus': { types: ['IoT', 'Software'], stage: 'Archived' },
  'smart-parking': { types: ['IoT', 'Software'], stage: 'Archived' },
  'live-commerce': { types: ['Software'], stage: 'Archived' },
  'esp32-hardware': { types: ['Hardware', 'IoT'], stage: 'Archived' },
  'enterprise-devops': { types: ['Software', 'Tools'], stage: 'Archived' },
};

const archiveOnly = new Set(['mengmaoquan', 'modbus-monitor', 'smart-fire-platform', 'smart-campus', 'smart-parking', 'live-commerce', 'esp32-hardware', 'enterprise-devops']);
export const fabricationNotes: Record<string, {
  design: string;
  use: string;
  verification: string;
  model?: { url: string; label: string };
}> = {
  'queue-caller': {
    design: 'V1为影片中的凸起飞线壳；V2新版平直飞线壳、V3新版PCB集成3D分别保留原生FreeCAD源与安装图。',
    use: '外壳设计可用于查看装配空间，并在试打印后检查开孔、固定点和操作手感。',
    verification: 'V1机械组装完成，但绿灯未亮、蜂鸣器偏弱；V2/V3继续保持PROVISIONAL，实配、电流、温升和整机验收待完成。',
    model: { url: 'https://github.com/LuoYaoSheng/queue-caller/tree/main/cad', label: '查看V1/V2/V3原生FreeCAD模型' },
  },
  'esp32-c3-weather-station': {
    design: '已有 ESP32-C3、传感器与 OLED 的机械布置方案，结构状态为 PROVISIONAL / HOLD。',
    use: '机械模型可用于检查器件布置，并在关键尺寸确认后安排试配。',
    verification: '模块配合、电气功能与整机验收待完成。',
  },
  'modular-ai-robot-kit': {
    design: '外壳规划包含纸盒和 3D 打印两条路线。当前首样采用纸盒与飞线。',
    use: '可先用纸样验证模块位置和走线，再据此迭代打印外壳。',
    verification: '纸盒实装、承力、通电与交互验证待完成。',
  },
};

function projectRecord(project: Project) {
  const details = getProjectDetails(project.slug);
  const states = metadata[project.slug] ?? { types: ['Software' as const], stage: 'Development' as const };
  return {
    ...project,
    ...states,
    details,
    archiveOnly: archiveOnly.has(project.slug),
    sources: (project.resources ?? []).flatMap((resource) =>
      resource.kind === 'source' && resource.href !== 'https://gitee.com/luoyaosheng/lys-apps-progress'
        ? [{ label: resource.label, href: resource.href }] : []),
    license: states.license ?? details.openResources.license,
  };
}

export const projects = projectShowcaseCases.map(projectRecord);
export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
export const stageLabels: Record<Stage, string> = {
  Active: '活跃', Development: '开发中', Preview: '预览', Prototype: '原型', Archived: '已归档',
};
export const projectUpdates = [
  {
    slug: 'smart-ble', date: '2026-11-25', type: '项目更新',
    title: '蓝析 BLE 开发预览与获取方式',
    description: '开发预览、构建指引和各平台的当前支持状态。',
  },
  {
    slug: 'esp32-c3-weather-station', date: '2026-11-25', type: '实验记录',
    title: 'ESP32-C3 天气站原型验证记录',
    description: '记录环境采集、屏幕和联网方案，以及待验证的机械与电气项目。',
  },
  {
    slug: 'queue-caller', date: '2026-11-25', type: '实践记录',
    title: 'QueueCaller 飞线样机阶段记录',
    description: '梳理数码管、实体按钮、状态灯和蜂鸣器的阶段验证。',
  },
];
