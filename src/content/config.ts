import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    author: z.string().default('LuoYaoSheng'),
    updated: z.date().optional(),
  }),
});

const videos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    platform: z.enum(['bilibili', 'youtube']),
    bvid: z.string().optional(),
    videoId: z.string().optional(),
    duration: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    author: z.string().default('LuoYaoSheng'),
  }),
});

export const collections = { blog, videos };
