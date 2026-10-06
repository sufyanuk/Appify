/**
 * Sample food photos from Wikimedia Commons, served by Wikimedia via
 * Special:FilePath (which redirects to a resized copy).
 *
 * To use your own photo instead, edit the dish in Admin → Food items and
 * upload it (or paste a link).
 */

const COMMONS = "https://commons.wikimedia.org/wiki";

const encode = (file: string) => encodeURIComponent(file.replace(/ /g, "_"));

/** Direct image URL for a Commons file, resized to `width` pixels. */
export function commonsPhoto(file: string, width = 960): string {
  return `${COMMONS}/Special:FilePath/${encode(file)}?width=${width}`;
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

  // Home page (high resolution originals)
  homeVadaPav: "Vada Pav-Indian street food.JPG",
  homeBiryani: "Chicken Biryani from the streets of Hyderabad.JPG",

  // Ramadan & Eid menu
  vegSamosa: "Samosa (Home Made) or Singara.jpg",
  nonVegSamosa: "Samosa with tamarind chutney and tomato sauce.jpg",
  tandoorSamosa: "Samosa - Homemade, Jabalpur - Madhya Pradesh - IMG 20210406 201834.jpg",
  cheeseSamosa: "Samosa cross section, Tokyo Japan.jpg",
  keemaSamosa: "Samosa (partially open).jpg",
  dahiVada: "Dahi vada or dahi bhalla.jpg",
  cutlets: "Chicken cutlets.jpg",
  vadaPav6: "Vada Pav.jpg",
  boxPatties: "Bangalore Egg puff.jpg",
  shamiKebab: "Chicken Shami Kabab.JPG",
  muttonShamiKebab: "Shikampuri Kabab.JPG",
  lagda: "Chana Masala- OLd Rao Hotel- Haryana.jpg",
  chanaMasala: "Chana masala.jpg",
  potatoChaat: "Alu Kabli.jpg",
  lagdaPetis: "Aloo Tikki Chaat.JPG",
  chickenSandwich: "Smoked Chicken Sandwich.jpg",
  vegSpringRolls: "Veg Roll.JPG",
  springRolls: "Spring rolls on sale.jpg",
  golaKebab: "Galawati Kebabs.JPG",
  chickenKofte: "Indian Chicken Seekh Kebab.jpg",
  muttonKofte: "Mutton Seekh Kabab.JPG",
  chickenBuns: "Buns 2.jpg",
  clubSandwich: "Club-sandwich.jpg",
  breadRolls: "Bread Roll.JPG",
  chapliKebab: "Chapli Kabab.JPG",
  nuggets: "Chicken Nuggets (3010738716).jpg",
  chickenBiryani: "Hyderabad Chicken Dum Biryani.jpg",
  muttonBiryani: "Hyderabadi mutton biryani.jpg",
  paaya: "Siri Paye .JPG",
  kheer: "Kheer.jpg",
  biscuitPudding: "Cabinet pudding (1).JPG",
  ghawna: "Neer Dosa.jpg",
  chickenClearSoup: "Chicken soup (broth).jpg",
  chineseSoup: "Mmm... hot and sour soup (7218396478).jpg",
  aalniPalniSoup: "Mulligatawny Soup.JPG",
  seafoodSoup: "Shrimp and corn chowder.jpg",
  muttonSoup: "Afghani Mutton Shorba.JPG",
} as const;
