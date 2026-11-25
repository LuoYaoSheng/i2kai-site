import type { APIRoute } from 'astro';
import { recentEntries } from '../data/content';
import { seoMeta, siteMeta } from '../data/site';

const escapeXml = (value: string) => value.replace(/[<>&"']/g, (match) =>
  ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[match]!);

export const GET: APIRoute = async () => {
  const entries = (await recentEntries()).slice(0, 24);
  const items = entries.map((entry) => {
    const url = new URL(entry.href, seoMeta.siteUrl).href;
    return `<item><title>${escapeXml(entry.title)}</title><link>${escapeXml(url)}</link>
      <guid isPermaLink="false">${escapeXml(`${url}#${entry.date.toISOString()}`)}</guid>
      <description>${escapeXml(entry.description)}</description><pubDate>${entry.date.toUTCString()}</pubDate>
      <category>${escapeXml(entry.type)}</category></item>`;
  });
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
  <title>${escapeXml(siteMeta.name)}</title><link>${seoMeta.siteUrl}/</link>
  <description>${escapeXml(siteMeta.description)}</description><language>zh-CN</language>
  <atom:link href="${seoMeta.siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
  ${items.join('\n')}
</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
