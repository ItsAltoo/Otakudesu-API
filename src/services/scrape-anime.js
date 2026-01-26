import { load } from "cheerio";
import axios from "axios";

export const scrapeAnime = async (url) => {
  try {
    const res = await axios.get(url)
    const html = res.data

    const $ = load(html);
    const venser = $("div.venser");
    const animeData = {};

    animeData.heading = venser.find("div.jdlrx h1").text().trim();
    animeData.subHeading = venser
      .find("div.subheading h2")
      .first()
      .text()
      .trim();
    animeData.imageUrl = venser.find("div.fotoanime img").attr("src") || "";
    animeData.synopsis = venser.find("div.sinopc p").text().trim();

    const detailData = {};
    venser.find("div.infozingle p").each((_, el) => {
      const keyRaw = $(el).find("b").text().trim();
      let value = $(el).find("span").text().trim();
      value = value.replace(keyRaw, "").replace(":", "").trim();

      if (keyRaw) {
        const key = keyRaw.toLowerCase().replace(/ /g, "_");
        detailData[key] = value;
      }
    });

    const episodeData = [];
    venser.find("div.episodelist ul li").each((_, el) => {
      const link = $(el).find("span a");
      const fullUrl = link.attr("href");
      const endpoint = new URL(fullUrl).pathname;
      
      episodeData.push({
        title: link.text().trim(),
        endpoint,
      });
    });

    return {
      status: "success",
      data: {
        ...animeData,
        details: detailData,
        episodes: episodeData,
      },
    };
  } catch (err) {
    console.error("Scraping Error:", err.message);
    throw new Error(err.message || "Failed to scrape");
  } finally {
    if (browser) await browser.close();
  }
};
