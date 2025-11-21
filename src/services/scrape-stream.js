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

      const streamLinks = [];
      $(el)
        .find("div.mirrorstream ul")
        .each((j, stream) => {
          const title = $(stream).attr("class").replace("m", "");

          const mediaList = [];
          $(stream)
            .find("li")
            .each((k, li) => {
              const quality = $(li).find("a").text().trim();
              const linkHref = $(li).find("a").attr("data-content") || "";

              let decodedString = "";
              if (linkHref) {
                try {
                  // Buat Buffer dari string Base64 dan ubah ke string 'utf8'
                  decodedString = Buffer.from(linkHref, "base64").toString(
                    "utf8"
                  );
                } catch (e) {
                  console.error("Gagal dekode Base64:", e.message);
                }
              }

              // --- TAMBAHKAN BLOK INI ---
              // 'decodedString' sekarang berisi: "{\"id\":185777,...}"
              // Kita perlu mengubahnya menjadi objek

              let streamData = null; // Variabel untuk menampung hasil akhir
              if (decodedString) {
                try {
                  // Ubah string JSON menjadi objek JavaScript
                  streamData = JSON.parse(decodedString);
                } catch (e) {
                  console.error("Gagal parse JSON:", decodedString);
                  // Jika gagal parse, simpan saja string aslinya
                  streamData = decodedString;
                }
              }

              mediaList.push({
                title: title,
                quality: quality,
                href: streamData,
              });
            });

          streamLinks.push({ title: streamLinks.title, media: mediaList });
        });
      animeData.stream_links = streamLinks;
    });

    return animeData;
  } catch (err) {
    console.log("Error");
    throw new Error("Failed scrape");
  }
};
