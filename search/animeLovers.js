import axios from "axios";

async function animeLovers(keyword) {
  try {
    if (!keyword) throw new Error("Keyword wajib diisi");

    const { data } = await axios.get(`https://apps.animekita.org/api/v1.1.9/search.php?keyword=${encodeURIComponent(keyword)}`, {
      headers: {
        "user-agent": "Dart/3.1 (dart:io)",
        accept: "application/json",
        "accept-encoding": "gzip",
        host: "apps.animekita.org",
        origin: "https://apps.animekita.org",
        referer: "https://apps.animekita.org/",
        connection: "keep-alive",
      },
      timeout: 60000,
      decompress: true,
    });

    if (!data) throw new Error("Response tidak ditemukan");

    return {
      success: true,
      results: data,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err?.response?.data ||
        err?.response?.status ||
        err.message,
    };
  }
}

animeLovers("death note")
.then((res) => console.log(JSON.stringify(res, null, 2)))
.catch(console.error);
