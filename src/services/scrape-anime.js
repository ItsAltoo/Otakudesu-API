// services/scrape-anime.js

import axios from "axios";
import { load } from "cheerio";

// 1. Jadikan fungsi ini ASYNC untuk menggunakan await
export const scrapeAnime = async (url) => {
  try {
    // 2. TUNGGU (await) hasil dari axios
    const response = await axios.get(url);
    const html = response.data;
    const $ = load(html);

    // Variabel ini akan menjadi OBJEK, bukan array, karena kita hanya scrape satu halaman detail
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

    // Ambil data utama

    // 3. Buat objek kosong untuk menampung detail info
    const details = {};

    // Iterasi untuk mengisi objek 'details'
    venser.find("div.infozingle p").each((i, el) => {
      const key = $(el).find("b").text().trim();
      let value = $(el).find("span").text().trim();
      value = value.replace(key, "").replace(":", "").trim();

      if (key) {
        const formattedKey = key.toLowerCase().replace(/ /g, "_");
        // 4. Isi objek 'details', bukan 'animeData'
        details[formattedKey] = value;
      }
    });

    // 5. Gabungkan semua data menjadi satu objek
    const finalData = {
      ...animeData,
      details: details, // Simpan semua detail info dalam properti 'details'
    };

    return finalData;
  } catch (err) {
    console.error("Error scraping anime data:", err);
    throw new Error("Failed to scrape anime data");
  }
};
