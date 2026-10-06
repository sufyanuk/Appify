/**
 * Real food photos from Wikimedia Commons (freely licensed, mostly CC BY /
 * CC BY-SA). Images are served by Wikimedia via Special:FilePath, which
 * redirects to a resized copy. Each photo's author and licence are on its
 * Commons page, linked from the public /credits page.
 *
 * To use your own photo instead, edit the dish in Admin → Food items and paste
 * its link into "Image URL".
 */

const COMMONS = "https://commons.wikimedia.org/wiki";

const encode = (file: string) => encodeURIComponent(file.replace(/ /g, "_"));

/** Direct image URL for a Commons file, resized to `width` pixels. */
export function commonsPhoto(file: string, width = 960): string {
  return `${COMMONS}/Special:FilePath/${encode(file)}?width=${width}`;
}

/** The Commons page for a file (author, licence, original). */
export function commonsPage(file: string): string {
  return `${COMMONS}/File:${encode(file)}`;
}

/** Commons file names, keyed by the dish they illustrate. */
export const PHOTOS = {
  fishThali: "Pomplet Fry Thali.jpg",
  chickenThali: "Malwani Chicken Thali.jpg",
  surmaiFry: "Surmai Fry - Panvel - Maharashtra - 33.jpg",
  surmaiPrawnCurry: "Surmai Fish fry with Prawns Curry - Our home at Pune - Maharashtra -IMG 5177.jpg",
  bangdaCurry: "Goan Mackerel Fish Curry Plate.jpg",
  bombilFry: "Fried Bombay Duck.JPG",
  fishKoliwada: "Fish Koliwada.JPG",
  kombdiVade: "Kombdi Vade.jpg",
  pithlaBhakri: "Pithal-Bhakari.jpg",
  misalPav: "Katakirr Misal Pav.jpg",
  vadaPav: "Vada pav plate.jpg",
  sabudanaVada: "Sabudana vada with chutney.JPG",
  modak: "Ukadiche Modak (Rice).jpg",
  modakPuneri: "Puneri Ukadiche Modak.jpg",
  aamrasPuranPoli: "Aamras Puran Poli.jpg",
  aamrasPuranPoli2: "Maharashtrian Aamrus and Puran-poli.jpg",
  solkadhi: "Solkadi-Konkani-Home.jpg",
  kokumSharbat: "Garcinia indica red and yellow kokum drinks prepared from syrups.jpg",
} as const;

export const PHOTO_CREDITS: { dish: string; file: string }[] = [
  { dish: "Malvani Fish Thali", file: PHOTOS.fishThali },
  { dish: "Malvani Chicken Thali", file: PHOTOS.chickenThali },
  { dish: "Surmai Fry", file: PHOTOS.surmaiFry },
  { dish: "Surmai Fry with Kolambi Curry", file: PHOTOS.surmaiPrawnCurry },
  { dish: "Bangda Curry Plate", file: PHOTOS.bangdaCurry },
  { dish: "Bombil Fry", file: PHOTOS.bombilFry },
  { dish: "Fish Koliwada", file: PHOTOS.fishKoliwada },
  { dish: "Kombdi Vade", file: PHOTOS.kombdiVade },
  { dish: "Pithla Bhakri", file: PHOTOS.pithlaBhakri },
  { dish: "Misal Pav", file: PHOTOS.misalPav },
  { dish: "Vada Pav", file: PHOTOS.vadaPav },
  { dish: "Sabudana Vada", file: PHOTOS.sabudanaVada },
  { dish: "Ukadiche Modak", file: PHOTOS.modak },
  { dish: "Ukadiche Modak (recipe)", file: PHOTOS.modakPuneri },
  { dish: "Aamras Puran Poli", file: PHOTOS.aamrasPuranPoli },
  { dish: "Aamras (recipe)", file: PHOTOS.aamrasPuranPoli2 },
  { dish: "Solkadhi", file: PHOTOS.solkadhi },
  { dish: "Kokum Sharbat", file: PHOTOS.kokumSharbat },
];
