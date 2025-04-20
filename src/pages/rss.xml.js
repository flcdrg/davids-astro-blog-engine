import atom from 'astrojs-atom';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection("blog");

  // return rss({
  //   title: 'David Gardiner',
  //   description: 'A blog of software development, .NET and other interesting things',
  //   site: context.site,
  //       items: posts.map((post) => ({
  //     title: post.data.title,
  //     pubDate: post.data.date,
  //     description: post.data.description,
  //     link: `/${post.id}.html`,
  //   })),
  //   customData: `<language>en-au</language>`,
  // });

  return atom({
    id: 'https://david.gardiner.net.au',
    title: 'David Gardiner',
    updated: new Date().toISOString(),
    description: 'A blog of software development, .NET and other interesting things',
    site: context.site,
    entry: posts.map((post) => ({
      id: `https://david.gardiner.net.au/${post.id}`,
      updated: post.data.date,
      title: post.data.title,
      content: post.data.description
    })),
  });
}