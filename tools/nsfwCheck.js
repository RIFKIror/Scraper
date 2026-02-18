import axios from "axios";
import FormData from "form-data";

async function nsfwCheck(url) {
  try {
    if (!url) throw new Error("URL gambar wajib diisi jir");
    if (!/^https?:\/\/.+/i.test(url)) throw new Error("URL gambar tidak valid");
   
    const { data: file } = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 60000,
      headers: {
        "user-agent": "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
        accept: "*/*",
      },
    });

    const buffer = Buffer.from(file);
    if (!buffer || buffer.length < 50) throw new Error("Gambar kosong / rusak");
    const form = new FormData();
    form.append("file", buffer, `image_${Date.now()}.jpg`);

    const { data } = await axios.post("https://www.nyckel.com/v1/functions/o2f0jzcdyut2qxhu/invoke",
      form,
      {
        headers: {
          ...form.getHeaders(),
          accept: "application/json, text/plain, */*",
        },
        timeout: 60000,
      }
    );

    if (!data) throw new Error("Response tidak ditemukan");
    
    return {
      success: true,
      result: data,
    };
  } catch (err) {
    return {
      success: false,
      message: "Yhh gagal cek nsfw nya",
      error:
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message,
      status: err?.response?.status || null,
    };
  }
}

// TEST LINK GAMBAR DISINI
nsfwCheck("https://img1.pixhost.to/images/11835/687738521_vynaa-valerie.jpg")
.then((res) => console.log(JSON.stringify(res, null, 2)))
.catch(console.error);
