import { scrapeAnimeStream } from "../services/scrape-stream.js";

export const fetchAnimeStream = async (req, res) => {
  const url =
    process.env.BASE_URL.replace(/\/$/, "") + `/episode/${req.params.id}`;

  try {
    const animeStream = await scrapeAnimeStream(url);
    if (!animeStream || Object.keys(animeStream).length === 0) {
      return res.status(404).json({ error: "Episode not found" });
    }
    res.json(animeStream);
  } catch (err) {
    console.error("Error fetching anime streaming:", err.message);
    res.status(500).json({
      error: "Failed to fetch anime streaming",
      message: err.message,
    });
  }
};
