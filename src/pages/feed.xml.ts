import atom from "astrojs-atom";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import type { APIContext } from "astro";
import getExcerpt from "../scripts/getExcerpt";
import onlyCurrent from "../scripts/filters";
const parser = new MarkdownIt();

function fixImageLinks(html: string) {
  // Replace all '../../assets' with '/assets'

  return html.replace(/<img[^>]+src="([^">]+)"/g, (match, src) => {
    const newSrc = src.replace("../../assets", "/assets");
    return match.replace(src, newSrc);
  });
}

export async function GET(context: APIContext) {
  const posts = (await getCollection("blog")).filter(onlyCurrent);

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
  const postsToInclude = sortedPosts.slice(0, 10); // Get the latest 10 posts

  const siteUrl = context.site?.toString();

  if (!siteUrl) {
    throw new Error("Site URL is not defined");
  }

  const atomFeedUrl = `${siteUrl}feed.xml`;

  return atom({
    id: atomFeedUrl,
    title: {
      value: "David Gardiner",
      type: "html",
    },
    author: [
      {
        name: "David Gardiner",
      },
    ],
    updated: new Date().toISOString(),
    subtitle:
      "A blog of software development, .NET and other interesting things",
    link: [
      {
        rel: "self",
        href: atomFeedUrl,
        type: "application/atom+xml",
      },
      {
        rel: "alternate",
        href: siteUrl,
        type: "text/html",
        hreflang: "en-AU",
      },
    ],
    lang: "en-AU",
    entry: postsToInclude.map((post) => {
      const htmlContent = fixImageLinks(
        sanitizeHtml(parser.render(post.body || ""), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        })
      );

      return {
        id: `${new URL(post.id, context.site).toString()}`,
        updated: post.data.date,
        published: post.data.date,
        title: post.data.title,
        content: {
          type: "html",
          value: htmlContent,
        },
        summary: {
          type: "html",
          value: post.data.description || getExcerpt(htmlContent, 500),
        },
        category: post.data.tags.map((tag) => ({
          term: tag,
        })),
        link: [
          {
            rel: "alternate",
            href: new URL(post.id, context.site).toString(),
            type: "text/html",
            title: post.data.title,
          },
        ],
        thumbnail: post.data.image
          ? {
              url: `${new URL(post.data.image.src, context.site).toString()}`,
            }
          : undefined,
      };
    }),
  });
}
