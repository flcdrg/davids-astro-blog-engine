import { DateTime } from "luxon";

const now = DateTime.now();

export default function onlyCurrent(post: {
  id: string;
  body?: string;
  collection: "blog";
  data: import("astro:content").InferEntrySchema<"blog">;
  rendered?: import("astro:content").RenderedContent;
  filePath?: string;
}) {
  if (import.meta.env.DEV) {
    return true;
  } else {
    return DateTime.fromISO(post.data.date) <= now;
  }
}
