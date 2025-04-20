import atom from 'astrojs-atom';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();


export async function GET(context) {
  const posts = await getCollection("blog");

  const sortedPosts = posts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  const postsToInclude = sortedPosts.slice(0, 10); // Get the latest 10 posts



  return atom({
    id: context.site.toString(),
    title: 'David Gardiner',
    updated: new Date().toISOString(),
    description: 'A blog of software development, .NET and other interesting things',
    site: context.site,
    entry: postsToInclude.map((post) => ({
      id: `${(new URL(post.id, context.site)).toString()}`,
      updated: post.data.date,
      title: post.data.title,
      content: {
        type: 'html',
        value: sanitizeHtml(parser.render(post.body), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
        }),
      }
    })),
  });
}