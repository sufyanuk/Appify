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

export const PHOTO_CREDITS: { dish: string; file: string }[] = [
  { dish: "Home page: Vada Pav", file: PHOTOS.homeVadaPav },
  { dish: "Home page: Chicken Biryani", file: PHOTOS.homeBiryani },
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
  { dish: "Veg Samosa", file: PHOTOS.vegSamosa },
  { dish: "Non-veg Samosa", file: PHOTOS.nonVegSamosa },
  { dish: "Chicken Tandoor Samosa", file: PHOTOS.tandoorSamosa },
  { dish: "Cheese Samosa", file: PHOTOS.cheeseSamosa },
  { dish: "Keema Samosa", file: PHOTOS.keemaSamosa },
  { dish: "Dahi Vada", file: PHOTOS.dahiVada },
  { dish: "Cutlets, Chicken Russian Kebab", file: PHOTOS.cutlets },
  { dish: "Vada Pav (6 pcs)", file: PHOTOS.vadaPav6 },
  { dish: "Box Patties", file: PHOTOS.boxPatties },
  { dish: "Beef Shami Kebab", file: PHOTOS.shamiKebab },
  { dish: "Mutton Shami Kebab", file: PHOTOS.muttonShamiKebab },
  { dish: "Lagda", file: PHOTOS.lagda },
  { dish: "Chana Masala", file: PHOTOS.chanaMasala },
  { dish: "Potato Chat", file: PHOTOS.potatoChaat },
  { dish: "Lagda Petis", file: PHOTOS.lagdaPetis },
  { dish: "Chicken Sandwiches", file: PHOTOS.chickenSandwich },
  { dish: "Veg Spring Rolls", file: PHOTOS.vegSpringRolls },
  { dish: "Non-Veg Spring Rolls, Chicken Chinese Rolls", file: PHOTOS.springRolls },
  { dish: "Gola Kebab", file: PHOTOS.golaKebab },
  { dish: "Chicken Kofte", file: PHOTOS.chickenKofte },
  { dish: "Mutton Kofte", file: PHOTOS.muttonKofte },
  { dish: "Chicken Buns", file: PHOTOS.chickenBuns },
  { dish: "Tandoori Club Sandwiches", file: PHOTOS.clubSandwich },
  { dish: "Chicken Bread Rolls", file: PHOTOS.breadRolls },
  { dish: "Chapli Kebab", file: PHOTOS.chapliKebab },
  { dish: "Nuggets", file: PHOTOS.nuggets },
  { dish: "Chicken Biryani", file: PHOTOS.chickenBiryani },
  { dish: "Mutton Biryani", file: PHOTOS.muttonBiryani },
  { dish: "Mutton Paaya, Beef Paaya", file: PHOTOS.paaya },
  { dish: "Kheer", file: PHOTOS.kheer },
  { dish: "Biscuit Delight", file: PHOTOS.biscuitPudding },
  { dish: "Ghawna", file: PHOTOS.ghawna },
  { dish: "Chicken Clear Soup", file: PHOTOS.chickenClearSoup },
  { dish: "Chinese Soup", file: PHOTOS.chineseSoup },
  { dish: "Aalni Palni Soup", file: PHOTOS.aalniPalniSoup },
  { dish: "Seafood Creamy Soup", file: PHOTOS.seafoodSoup },
  { dish: "Mutton Soup", file: PHOTOS.muttonSoup },
];
