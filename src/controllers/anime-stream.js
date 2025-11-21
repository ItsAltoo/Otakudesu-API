import { scrapeAnimeStream } from "../services/scrape-stream.js";

export const fetchAnimeStream = async (req, res) => {
  const url =
    process.env.BASE_URL.replace(/\/$/, "") + `/episode/${req.params.id}`;

  try {
    const animeStream = await scrapeAnimeStream(url);
    res.json(animeStream);
  } catch (err) {
    console.error("Error fetching anime streaming :", err);
    res.status(500).json({ error: "Failed to fetch anime streaming" });
  }
};
