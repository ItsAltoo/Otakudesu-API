import axios from "axios";
import { load } from "cheerio";
import { getRequestHeaders } from "../utils/request-headers.js";
import { gotScraping } from "got-scraping";

export const scrapeBatch = async (url) => {
  try {
    const res = await gotScraping({
      url: url,
      headerGeneratorOptions: {
        browsers: [{ name: "chrome", minVersion: 110 }],
        devices: ["desktop"],
        locales: ["en-US", "id-ID"],
      },
    });
    const html = res.body;
    const $ = load(html);

    const batchList = [];

    $("div.batchlink h4").each((index, element) => {
      const $h4 = $(element);
      const batchTitle = $h4.text().trim();

      const $ul = $h4.next("ul");
      const downloads = [];

      $ul.find("li").each((i, li) => {
        const $li = $(li);

        const quality = $li.find("strong").text().trim();
        const size = $li.find("i").text().trim();

        const servers = [];
        $li.find("a").each((j, a) => {
          const $a = $(a);
          servers.push({
            name: $a.text().trim(),
            link: $a.attr("href"),
          });
        });

        if (quality) {
          downloads.push({
            quality,
            size,
            servers,
          });
        }
      });

      // Masukkan hasil per-batch ke array utama
      batchList.push({
        batch_title: batchTitle,
        downloads: downloads,
      });
    });

    return batchList;
  } catch (err) {
    console.log("error");
    throw new Error("Failed Scrape", err);
  }
};
