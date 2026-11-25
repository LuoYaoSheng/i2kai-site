import { getCollection, type CollectionEntry } from 'astro:content';
import { getProject, projectUpdates } from './projects';

export type Post = CollectionEntry<'blog'>;
export type Video = CollectionEntry<'videos'>;
type VideoShareData = Extract<Video['data'], { kind: 'share' }>;
export type VideoShare = Video & { data: VideoShareData };

export const isShare = (video: Video): video is VideoShare => video.data.kind === 'share';
export const articlePath = (post: Post) => `/blog/${post.slug}/`;
export const videoPath = (video: Video) => `/videos/${isShare(video) ? video.slug : video.id}/`;
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);
export const linkedProjects = ({ projectId, projectIds }: { projectId?: string; projectIds: string[] }) =>
  [...new Set([...(projectId ? [projectId] : []), ...projectIds])];

export async function articles() {
  return (await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.slug.localeCompare(b.slug));
}

export async function videos() {
  return (await getCollection('videos', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.slug.localeCompare(b.slug));
}

export function videoSource(video: Video) {
  const data = video.data;
  const source = data.kind === 'share' ? data.source : undefined;
  if (source?.platform === 'external') return { name: source.name, watch: source.url };
  const platform = data.kind === 'share' ? data.source.platform : data.platform;
  const name = platform === 'bilibili' ? 'Bilibili' : 'YouTube';
  const id = source?.id ?? (data.kind !== 'share' ? (platform === 'bilibili' ? data.bvid : data.videoId) : undefined);
  const valid = platform === 'bilibili' ? /^BV[0-9A-Za-z]{10}$/ : /^[0-9A-Za-z_-]{11}$/;
  if (!id || !valid.test(id)) return { name };
  const embed = source?.embed ?? !source;
  if (platform === 'bilibili') return {
    name,
    watch: `https://www.bilibili.com/video/${id}/`,
    embed: embed ? `https://player.bilibili.com/player.html?bvid=${id}&page=1&autoplay=0` : undefined,
  };
  return {
    name,
    watch: `https://www.youtube.com/watch?v=${id}`,
    embed: embed ? `https://www.youtube-nocookie.com/embed/${id}` : undefined,
  };
}

export const articleType = { article: '技术文章', practice: '实践记录', experiment: '实验记录' };

export async function recentEntries() {
  const [posts, allVideos] = await Promise.all([articles(), videos()]);
  return [
    ...posts.map((post) => ({
      title: post.data.title, date: post.data.updated ?? post.data.date, href: articlePath(post),
      description: post.data.description, type: articleType[post.data.kind], category: post.data.category,
    })),
    ...allVideos.map((video) => ({
      title: video.data.title, date: video.data.date, href: videoPath(video),
      description: video.data.description, type: isShare(video) ? '视频分享' : '视频笔记', category: video.data.category,
    })),
    ...projectUpdates.flatMap(({ slug, title, date, type, description }) => {
      const project = getProject(slug);
      return project ? [{ title, date: new Date(date), type, description, href: `/showcase/${slug}/`, category: project.types[0] }] : [];
    }),
  ].sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
