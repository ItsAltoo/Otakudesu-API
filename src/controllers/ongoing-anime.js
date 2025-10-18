import { scrapeAnimeList } from "../services/scrape-anime-list.js";

export const fetchOngoingAnime = async (req, res) => {
  const url = process.env.BASE_URL.replace(/\/$/, "") + "/ongoing-anime";
  const page = req.params.page || 1;
  const paginatedUrl = page > 1 ? `${url}/page/${page}` : url;

  try {
    const data = await scrapeAnimeList(paginatedUrl);
    res.json({
      message: "Ongoing anime fetched successfully",
      page: page,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ongoing anime" });
  }
};
