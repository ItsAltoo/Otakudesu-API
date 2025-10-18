import { scrapeAnimeList } from "../services/scrape-anime-list.js";

export const fetchCompleteAnime = async (req, res) => {
  const url = process.env.BASE_URL.replace(/\/$/, "") + "/complete-anime";
  const page = req.params.page || 1;
  const paginatedUrl = `${url}/page/${page}`;

  try {
    const animeList = await scrapeAnimeList(paginatedUrl);
    res.json(animeList);
  } catch (error) {
    console.error("Error fetching complete anime:", error);
    res.status(500).json({ error: "Failed to fetch complete anime" });
  }
};

