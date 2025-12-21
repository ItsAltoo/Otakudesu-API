import axios from "axios";
import { load } from "cheerio";

export const scrapeAnimeStream = async (url) => {
  try {
    const res = await axios.get(url);
    const html = res.data;
    const $ = load(html);

    const animeData = {};

    $("div.venser").each((i, el) => {
      animeData.title = $(el).find("div.venutama h1.posttl").text().trim();

      const pagination = [];
      $(el)
        .find("div.flir a")
        .each((j, a) => {
          const title = $(a).text().trim();
          const pageHref = $(a).attr("href") || "";
          const href = new URL(pageHref).pathname;
          pagination.push({ title: title, href: href });
        });
      animeData.pagination = pagination;

      const streamLinks = $(el)
        .find("div.responsive-embed-stream iframe")
        .attr("src")
        .trim();
      animeData.stream_links = streamLinks;

      const downloadLinks = [];
      $(el)
        .find("div.download ul")
        .each((k, d) => {
          $(el)
          .find("li")
          .each((l, d) => {
              const title = $(d).find("strong").text().trim();
              const quality = $(d).find("a").text().trim();
              const linkHref = $(d).find("a").attr("href") || "";

              downloadLinks.push({
                title: title,
                quality: quality,
                link: linkHref,
              });
            });
        });
      animeData.download_links = downloadLinks;
    });

    return animeData;
  } catch (err) {
    console.log("Error");
    throw new Error("Failed scrape");
  }
};
