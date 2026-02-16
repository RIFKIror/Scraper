import axios from "axios";
import * as cheerio from "cheerio";

async function mangaSearch(query) {
  try {
    const q = query.trim();
    if (!q) throw new Error("Query kosong, harap diisi");
    
    const res = await axios.get(`https://myanimelist.net/manga.php?q=${q}&cat=manga`);
    const $ = cheerio.load(res.data);
    const results = [];

    $("table tbody tr").each((i, el) => {
      const cover = $(el).find("td:nth-child(1) img").attr("data-src") || $(el).find("td:nth-child(1) img").attr("src") || null;
      const title = $(el).find("td:nth-child(2) strong").text().trim() || null;
      const mangaUrl = $(el).find("td:nth-child(2) a").attr("href") || null;
      const type = $(el).find("td:nth-child(3)").text().trim() || null;
      const vol = $(el).find("td:nth-child(4)").text().trim() || null;
      const score = $(el).find("td:nth-child(5)").text().trim() || null;
      const description =
        $(el)
          .find("td:nth-child(2) .pt4")
          .text()
          .replace("read more.", "")
          .trim() || "No Desc";

      if (title && mangaUrl) {
        results.push({
          no: i + 1,
          title,
          url: mangaUrl,
          cover,
          description,
          info: {
            type,
            vol,
            score,
          },
        });
      }
    });

    if (!results.length) {
      return {
        success: false,
        message: "Manga tidak ditemukan",
        query: q,
        total: 0,
        results: [],
      };
    }

    return {
      success: true,
      query: q,
      total: results.length,
      results,
    };
  } catch (err) {
    return {
      success: false,
      message: "Gagal mengambil data manga MAL",
      query,
      error: err.message,
    };
  }
}

mangaSearch("death note")
.then((res) => console.log(JSON.stringify(res, null, 2)))
.catch(console.error);
