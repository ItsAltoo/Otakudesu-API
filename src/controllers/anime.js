import { scrapeAnime } from "../services/scrape-anime.js";

export const fetchAnimeDetails = async (req, res) => {
  const url =
    process.env.BASE_URL.replace(/\/$/, "") + `/anime/${req.params.id}`;

  try {
    const animeDetails = await scrapeAnime(url);
    if (!animeDetails || Object.keys(animeDetails).length === 0) {
      return res.status(404).json({ error: "Anime not found" });
    }
    res.json(animeDetails);
  } catch (error) {
    console.error("Error fetching anime details:", error.message);
    res.status(500).json({
      error: "Failed to fetch anime details",
      message: error.message,
    });
  }
};
