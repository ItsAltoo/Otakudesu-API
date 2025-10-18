import { scrapeAnime } from "../services/scrape-anime.js";

export const fetchAnimeDetails = async (req, res) => {
    const url = process.env.BASE_URL.replace(/\/$/, "") + `/anime/${req.params.id}`; 

    try {
        const animeDetails = await scrapeAnime(url);
        res.json(animeDetails);
    } catch (error) {
        console.error("Error fetching anime details:", error);
        res.status(500).json({ error: "Failed to fetch anime details" });
    }
}