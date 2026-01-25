import { load } from "cheerio";
import { getBrowser } from "../utils/browser.js";

export const scrapeAnime = async (url) => {
  let browser = null;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        ["image", "stylesheet", "font", "media"].includes(req.resourceType())
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

    try {
      await page.waitForSelector("div.venser", { timeout: 10000 });
    } catch (e) {
      throw new Error(
        "Timeout: Terjebak di Cloudflare atau elemen tidak ditemukan.",
      );
    }

    const html = await page.content();

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
