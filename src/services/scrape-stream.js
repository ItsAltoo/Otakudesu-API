import axios from "axios";
import { load } from "cheerio";

export const scrapeAnimeStream = async (url) => {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
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
    console.log("Error");
    throw new Error("Failed scrape");
  }
};
