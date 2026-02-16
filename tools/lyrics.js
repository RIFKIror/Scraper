import axios from "axios";

async function lyricsSearch(title) {
  try {
    const keyword = String(title).trim();
    if (!keyword) throw new Error("Title kosong jir");

    const { data } = await axios.get(`https://lrclib.net/api/search?q=${encodeURIComponent(keyword)}`, {
      headers: {
        accept: "application/json, text/plain, */*",
        referer: `https://lrclib.net/search/${encodeURIComponent(keyword)}`,
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      },
      timeout: 60000,
    });

    if (!data) throw new Error("Respons tidak ditemukan");
    if (!Array.isArray(data)) throw new Error("Response tidak valid");
    const results = data.map((v) => ({
      id: v?.id ?? null,
      name: v?.name ?? null,
      track: v?.trackName ?? null,
      artist: v?.artistName ?? null,
      album: v?.albumName ?? null,
      duration: v?.duration ?? null,
      instrumental: v?.instrumental ?? false,
      songs: {
        lyrics: v?.plainLyrics ?? null,
      },
    }));

    return {
      success: true,
      query: keyword,
      total: results.length,
      results,
    };
  } catch (err) {
    return {
      success: false,
      message: "Gagal mencari lyrics",
      error:
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message,
      status: err?.response?.status || null,
    };
  }
}

lyricsSearch("i bet on losing dogs")
.then((res) => console.log(JSON.stringify(res, null, 2)))
.catch((err) => console.error(err));
