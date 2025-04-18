import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection("blog");

  return rss({
    title: 'David Gardiner',
    description: 'A blog of software development, .NET and other interesting things',
    site: context.site,
        items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/${post.id}.html`,
    })),
    customData: `<language>en-au</language>`,
  });
}