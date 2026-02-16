import axios from "axios";
import * as cheerio from "cheerio";

async function savetikDl(url) {
  try {
    if (!url) throw new Error("Link nya mana jir");
    if (typeof url !== "string") throw new Error("Link harus berupa string");
    
    const valid = url.includes("tiktok.com") || url.includes("vt.tiktok.com") || url.includes("https://");
    if (!valid) throw new Error("Link TikTok tidak valid");

    const res = await axios.post("https://savetik.co/api/ajaxSearch",
      new URLSearchParams({ q: url, lang: "id" }).toString(),
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Linux; Android 10)",
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Origin: "https://savetik.co",
          Referer: "https://savetik.co/id1",
        },
      }
    );

    const $ = cheerio.load(res.data?.data || "");
    const title = $("h3").first().text().trim() || null;
    const cover = $(".image-tik img").attr("src") || $(".thumbnail img").attr("src") || null;
    const mp4 = $('.dl-action a:contains("MP4")').not(':contains("HD")').attr("href") || null;
    const mp4_hd = $('.dl-action a:contains("HD")').attr("href") || null;
    const mp3 = $('.dl-action a:contains("MP3")').attr("href") || null;
    const img = $('.photo-list a[href*="snapcdn"]').map((_, e) => $(e).attr("href")).get() || [];

    return {
      success: true,
      link: url,
      download: {
        title,
        cover,
        mp4,
        mp4_hd,
        mp3,
        img,
      },
    };
  } catch (e) {
    return { success: false, link: url, error: e.message };
  }
}

savetikDl("https://vt.tiktok.com/ZSmjmQovR/")
  .then((res) => console.log(JSON.stringify(res, null, 2)))
  .catch((err) => console.error(err));
