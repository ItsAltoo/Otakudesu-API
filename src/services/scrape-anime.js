import axios from "axios";
import { load } from "cheerio";

export const scrapeAnime = async (url) => {
  try {
    const response = await axios.get(url,{
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    const html = response.data;
    const $ = load(html);

    const animeData = {};

    const venser = $("div.venser").each((i, element) => {
      animeData.heading = $(element).find("div.jdlrx h1").text().trim();
      animeData.subHeading = $(element)
        .find("div.subheading h2")
        .eq(0)
        .text()
        .trim();
      animeData.imageUrl =
        $(element).find("div.fotoanime img").attr("src") || "";
      animeData.synopsis = $(element).find("div.sinopc p").text().trim();
    });

    const detailData = {};
    venser.find("div.infozingle p").each((i, el) => {
      const key = $(el).find("b").text().trim();
      let value = $(el).find("span").text().trim();
      value = value.replace(key, "").replace(":", "").trim();

      if (key) {
        const formattedKey = key.toLowerCase().replace(/ /g, "_");
        detailData[formattedKey] = value;
      }
    });

    const batchData = {};
    venser
      .find("div.episodelist ul li span a")
      .eq(0)
      .each((i, el) => {
        batchData.title = $(el).text().trim();
        const fullHref = $(el).attr("href") || "";
        batchData.href = new URL(fullHref).pathname;
      });

    const episodeData = {};
    venser
      .find("div.episodelist ")
      .eq(1)
      .each((i, el) => {
        episodeData.heading = $(el)
          .find("div.smokelister span.monktit")
          .text()
          .trim();

        const episodes = [];
        episodeData.episodes_list = $(el)
          .find("ul li")
          .each((j, li) => {
            const epTitle = $(li).find("span a").text().trim();
            const fullHref = $(li).find("span a").attr("href") || "";
            const href = new URL(fullHref).pathname;
            episodes.push({ title: epTitle, href });
          });
        episodeData.episodes_list = episodes;
      });

    const finalData = {
      ...animeData,
      detailData: detailData,
      streaming: {
        batch: batchData,
        episode: episodeData,
      },
    };

    return finalData;
  } catch (err) {
    console.error("Error scraping anime data:", err);
    throw new Error("Failed to scrape anime data");
  }
};
