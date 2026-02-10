import axios from "axios";
import * as cheerio from "cheerio";

const cookieJoin = (arr = []) =>
  Array.isArray(arr) ? arr.map((v) => v.split(";")[0]).join("; ") : "";

const csrfPick = (html) =>
  html.match(/name="csrf_token"\s+value="([^"]+)"/i)?.[1] || null;

async function getSession() {
  const res = await axios.get('https://savett.cc/en1/download', {
    headers: { "User-Agent": "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36", Accept: "text/html,*/*" },
  });

  const csrf = csrfPick(res.data);
  const cookie = cookieJoin(res.headers["set-cookie"]);

  if (!csrf || !cookie) throw new Error("Gagal ambil CSRF/Cookie");
  return { csrf, cookie };
}

async function postDownload(url, session) {
  const body = new URLSearchParams({ csrf_token: session.csrf, url });

  const res = await axios.post('https://savett.cc/en1/download', body.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded",
      Origin: "https://savett.cc",
      Referer: "https://savett.cc/en1/download",
      Cookie: session.cookie,
      Accept: "text/html,*/*",
    },
  });

  return res.data;
}

export async function tiktokDl(url) {
  try {
    const session = await getSession();
    const html = await postDownload(url, session);
    const $ = cheerio.load(html);

    const detail = [];
    $("#video-info .my-1 span").each((_, el) => detail.push($(el).text().trim()));

    const username = $("#video-info h3").first().text().trim() || null;
    const duration =
      $("#video-info p.text-muted")
        .first()
        .text()
        .replace(/Duration:/i, "")
        .trim() || null;

    const slides = [];
    $(".carousel-item[data-data]").each((_, el) => {
      try {
        const raw = $(el).attr("data-data")?.replace(/&quot;/g, '"');
        const json = JSON.parse(raw);
        if (Array.isArray(json?.URL)) slides.push(...json.URL);
      } catch {}
    });

    const nowm = [];
    const mp3 = [];

    $("#formatselect option").each((_, el) => {
      const label = $(el).text().toLowerCase();
      const raw = $(el).attr("value");
      if (!raw) return;

      try {
        const json = JSON.parse(raw.replace(/&quot;/g, '"'));
        if (!Array.isArray(json?.URL)) return;

        if (label.includes("mp4") && !label.includes("watermark")) {
          nowm.push(...json.URL);
        }

        if (label.includes("mp3")) {
          mp3.push(...json.URL);
        }
      } catch {}
    });

    return {
      status: true,
      result: {
        username,
        duration,
        stats: {
          views: detail[0] || null,
          likes: detail[1] || null,
          comments: detail[3] || null,
          shares: detail[4] || null,
        },
        download: {
          type: slides.length ? "photo" : "video",
          download: nowm,
          mp3,
        },
      },
    };
  } catch (err) {
    return { status: false, message: err.message };
  }
}

// DOWNLOAD TIKTOK NYA
tiktokDl("https://vt.tiktok.com/ZSmdmLNKY/")
  .then((res) => console.log(JSON.stringify(res, null, 2)))
  .catch(console.error);
