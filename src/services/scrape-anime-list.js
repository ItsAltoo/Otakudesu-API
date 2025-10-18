import { load } from "cheerio";
import axios from "axios";

export const scrapeAnimeList = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);

    const animeList = [];

    $("div.detpost").each((index, element) => {
      const title = $(element).find("h2.jdlflm").text().trim();
      const episode = $(element).find("div.epz").text().trim();
      const imageUrl = $(element).find("img").attr("src") || "";
      const epzTipe = $(element).find("div.epztipe").text().trim();
      const newNime = $(element).find("div.newnime").text().trim();
      const fullHref = $(element).find("div.thumb a").attr("href") || "";
      const endpoint = new URL(fullHref).pathname;

      animeList.push({
        title,
        episode,
        imageUrl,
        epzTipe,
        newNime,
        href: endpoint,
      });
    });

    return animeList;
  } catch (err) {
    console.error(`Error fetching ongoing anime: ${err}`);
    throw new Error("Failed to fetch ongoing anime");
  }
};