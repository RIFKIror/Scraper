import axios from "axios";

async function ssweb(url, opt = {}) {
  try {
    if (!url || typeof url !== "string") throw new Error("URL wajib diisi");
    if (!url.startsWith("https://")) throw new Error("URL harus diawali https://");
    const {
      width = 1280,
      height = 720,
      fullPage = false,
      scale = 1,
    } = opt;
    if (isNaN(width) || isNaN(height) || isNaN(scale)) {
      throw new Error("Width, height, dan scale harus angka");
    }
    if (typeof fullPage !== "boolean") {
      throw new Error("fullPage harus boolean (true/false)");
    }

    const payload = {
      url,
      browserWidth: Number(width),
      browserHeight: Number(height),
      fullPage,
      deviceScaleFactor: Number(scale),
      format: "png",
    };

    const res = await axios.post(
      "https://gcp.imagy.app/screenshot/createscreenshot",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
           Referer: "https://imagy.app/full-page-screenshot-taker/",
           Accept: "application/json, text/plain, */*",
           Origin: "https://imagy.app",
        },
      }
    );

    const fileUrl = res.data?.fileUrl || null;
    if (!fileUrl) throw new Error("Gagal mendapatkan screenshot url");
    return {
      success: true,
      url,
      result: fileUrl,
    };
  } catch (err) {
    return {
      success: false,
      url,
      error: err.message,
    };
  }
}

// Bisa custom sendiri width, height sama scale nya (Sesuaikan aj)
ssweb("https://api.lexcode.biz.id", {
  width: 800,
  height: 360,
  fullPage: true,
  scale: 2,
})
  .then((res) => console.log(JSON.stringify(res, null, 2)))
  .catch((err) => console.error(err));
