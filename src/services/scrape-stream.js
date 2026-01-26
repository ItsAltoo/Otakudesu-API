import axios from "axios";
import { load } from "cheerio";

export const scrapeAnimeStream = async (url) => {
  try {
    const res = await axios.get(url)
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

      const streamIframe = $(el).find("div.responsive-embed-stream iframe");
      const streamLinks =
        streamIframe.length > 0 ? streamIframe.attr("src") : "";
      animeData.stream_links = streamLinks || "";

      const downloadLinks = [];
      $(el)
        .find("div.download ul li")
        .each((k, d) => {
          const quality = $(d).find("strong").text().trim();
          const size = $(d).find("i").text().trim();

          const servers = [];
          $(d)
            .find("a")
            .each((i, a) => {
              const $a = $(a);
              servers.push({
                name: $a.text().trim(),
                link: $a.attr("href"),
              });
            });

          downloadLinks.push({
            quality,
            size,
            servers,
          });
        });
      animeData.download_links = downloadLinks;
    });

    return animeData;
  } catch (err) {
    console.error("Error scraping anime stream:", err.message);
    throw new Error("Failed to scrape anime stream: " + err.message);
  }
};
