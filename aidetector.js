import axios from "axios";

export async function aidetector(text) {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Text wajib diisi dan harus berupa string");
    }

    const res = await axios.post("https://undetectable.ai/detector-humanizer",
      [text, "l6_v6", false],
      {
        headers: {
          "next-action": "8b888df218472b367d6709b65423720937e55d44",
          "next-router-state-tree": '%5B%22%22%2C%7B%22children%22%3A%5B%5B%22locale%22%2C%22en%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22(pages-with-loader)%22%2C%7B%22children%22%3A%5B%22detector-humanizer%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Fdetector-humanizer%22%2C%22refresh%22%5D%7D%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D',
          "x-deployment-id": "dpl_5AoF5tkK5GdFjjV23UefgnT3Bd4W",
          origin: "https://undetectable.ai",
          referer: "https://undetectable.ai/detector-humanizer",
          "user-agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
          accept: "*/*",
          "content-type": "text/plain;charset=UTF-8",
        },
      }
    );

    const raw = typeof res.data === "string" ? res.data : JSON.stringify(res.data);

    const id = raw.match(/"id":"([^"]+)"/)?.[1];
    if (!id) throw new Error("Gagal ambil ID result dari undetectable.ai");

    const { data } = await axios.post("https://sea-lion-app-3p5x4.ondigitalocean.app/query",
      { id },
      {
        headers: {
          origin: "https://undetectable.ai",
          referer: "https://undetectable.ai/",
          "user-agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
          accept: "application/json, text/plain, */*",
          "content-type": "application/json",
        },
      }
    );

    const human = data?.result_details?.human ?? null;
    const ai = human !== null ? Math.max(0, 100 - human) : null;
    const aiPersen = `${ai}%`;
    const humanPersen = `${human}%`;

    return {
      success: true,
      result: {
        id: data?.id || id,
        model: data?.model || "l6_v6",
        status: data?.status || null,
        percent: {
          aiPersen,
          humanPersen,
        },
        details: data?.result_details || null,
      },
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

aidetector("Pemandangan indah di pantai adalah salah satu keindahan alam yang paling mempesona. Pantai dengan pasir putih yang lembut, air laut yang jernih dan biru, serta ombak yang menghantam pantai dengan lembut, menciptakan suasana yang sangat tenang dan damai. ")
  .then((res) => console.log(JSON.stringify(res, null, 2)))
  .catch((err) => console.error(err));
