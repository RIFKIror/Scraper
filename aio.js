import axios from 'axios';
import * as cheerio from 'cheerio';

function generateHash(url, key) {
  const base64Url = Buffer.from(url).toString('base64');
  const base64Key = Buffer.from(key).toString('base64');
  return base64Url + (url.length + 1000) + base64Key;
}

async function aio(link) {
  try {
    if (!link || typeof link !== 'string') {
      throw new Error('Link nya mana wokk');
    }

    if (!link.includes('http://') && !link.includes('https://')) {
      throw new Error('Link tidak valid woilah');
    }

    const homepageResponse = await axios.get('https://anydownloader.com/en', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });

    const $ = cheerio.load(homepageResponse.data);
    const tokenInput = $('input[name="token"]');
    const tokenValue = tokenInput.attr('value') || tokenInput.val();
    if (!tokenValue) {
      throw new Error('Token not found on the page');
    }

    const hashValue = generateHash(link, 'api');
    const formData = new URLSearchParams();
    formData.append('url', link);
    formData.append('token', tokenValue);
    formData.append('hash', hashValue);
    const downloadResponse = await axios.post('https://anydownloader.com/wp-json/api/download/',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Origin': 'https://anydownloader.com',
          'Referer': 'https://anydownloader.com/en',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );

    if (!downloadResponse.data) {
      throw new Error('Tidak ada respons dari server');
    }

    return downloadResponse.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Yh server error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error('Tidak ada response ditemukan');
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
}

// MASUKIN LINK VIDIO YG MAU DI DOWNLOAD
aio("https://vt.tiktok.com/ZSmRMgJdS/")
.then(res => console.log(JSON.stringify(res, null, 2)))
.catch(err => console.error(err.message))
