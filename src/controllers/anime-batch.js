import { scrapeBatch } from "../services/scrape-batch.js";

export const fetchAnimeBatchDownload = async (req, res) => {
  const url =
    process.env.BASE_URL.replace(/\/$/, "") + `/batch/${req.params.id}`;
  try {
    const animeBatch = await scrapeBatch(url);
    res.json(animeBatch);
  } catch (err) {
    console.error("Error fetching anime batch download :", err);
    res.status(500).json({ error: "Failed to fetch anime batch download" });
  }
};
