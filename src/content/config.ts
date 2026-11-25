import { defineCollection, z } from 'astro:content';

import { articleCategories, videoCategories } from '../data/taxonomy';

const httpsUrl = z.string().refine((value) => {
  if (!URL.canParse(value)) return false;
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
}, '必须使用不含凭据的 HTTPS 地址');

const related = {
  projectId: z.string().optional(), // 历史字段，保留旧内容兼容性
  projectIds: z.array(z.string()).default([]),
  seriesIds: z.array(z.string()).default([]),
  hasUpdateNotice: z.boolean().optional(),
};

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    category: z.enum(articleCategories).default('软件开发'),
    kind: z.enum(['article', 'practice', 'experiment']).default('article'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    ...related,
    heroImage: z.string().optional(),
    author: z.string().default('LuoYaoSheng'),
    updated: z.date().optional(),
  }),
});

const videoSource = z.discriminatedUnion('platform', [
  z.object({ platform: z.literal('bilibili'), id: z.string().regex(/^BV[0-9A-Za-z]{10}$/), embed: z.boolean().default(false) }),
  z.object({ platform: z.literal('youtube'), id: z.string().regex(/^[0-9A-Za-z_-]{11}$/), embed: z.boolean().default(false) }),
  z.object({ platform: z.literal('external'), name: z.string().min(1), url: httpsUrl }),
]);

const videoBase = z.object({
  title: z.string(),
  date: z.date(),
  description: z.string(),
  category: z.enum(videoCategories).default('IoT'),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  duration: z.string().optional(),
  ...related,
});

const videos = defineCollection({
  type: 'content',
  schema: z.union([
    videoBase.extend({
      kind: z.literal('share'),
      source: videoSource,
      originalAuthor: z.string().min(1),
      originalDate: z.date(),
      cover: httpsUrl,
      recommendation: z.string().min(1),
      featured: z.boolean().default(false),
      articleIds: z.array(z.string()).default([]),
    }),
    videoBase.extend({
      kind: z.literal('note').optional(),
      platform: z.enum(['bilibili', 'youtube']),
      bvid: z.string().optional(),
      videoId: z.string().optional(),
      author: z.string().default('LuoYaoSheng'),
      heroImage: z.string().optional(),
    }),
  ]),
});

export const collections = { blog, videos };
