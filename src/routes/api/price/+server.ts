import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const url = 'https://live.euronext.com/en/ajax/getDetailedQuote/FR0011053636-ALXP';

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'  // wichtig, damit die Seite nicht blockt
      }
    });

    if (!res.ok) {
      return json({ error: `Euronext returned status ${res.status}` }, { status: res.status });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const price = $('#header-instrument-price').text().trim();

    if (!price) {
      return json({ error: 'Kurs nicht gefunden' }, { status: 404 });
    }

    return json({ price });
  } catch (error) {
    console.error(error);
    return json({ error: 'Fehler beim Abrufen der Kursdaten' }, { status: 500 });
  }
}
