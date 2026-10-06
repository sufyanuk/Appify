/**
 * Seeds the database with the Kokni Jevan sample menu, easy Kokni recipes and
 * the admin user. Run with: npm run db:seed   (safe to re-run — it only fills
 * empty tables, so your own edits are never overwritten)
 */
import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import { PHOTOS, commonsPhoto } from "../src/lib/photos";

const db = new PrismaClient();

// Prices are in dirhams (QAR 1 = 100 dirhams).
const qar = (riyals: number) => Math.round(riyals * 100);

const foodItems = [
  {
    name: "Malvani Fish Thali",
    description: "Pomfret fry, Malvani fish curry, solkadhi, rice and bhakri.",
    priceCents: qar(45),
    category: "Rice Items",
    image: commonsPhoto(PHOTOS.fishThali),
  },
  {
    name: "Malvani Chicken Thali",
    description: "Chicken sukka, chicken curry, solkadhi, chapati, rice, chutney and pickle.",
    priceCents: qar(38),
    category: "Rice Items",
    image: commonsPhoto(PHOTOS.chickenThali),
  },
  {
    name: "Surmai Fry",
    description: "Kingfish steaks in a spicy Malvani masala, shallow-fried in a rava crust.",
    priceCents: qar(40),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.surmaiFry),
  },
  {
    name: "Surmai Fry with Kolambi Curry",
    description: "Crispy surmai fry served with a rich coconut prawn curry.",
    priceCents: qar(48),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.surmaiPrawnCurry),
  },
  {
    name: "Bangda Curry Plate",
    description: "Mackerel in a tangy kokum and coconut curry, served with rice.",
    priceCents: qar(30),
    category: "Rice Items",
    image: commonsPhoto(PHOTOS.bangdaCurry),
  },
  {
    name: "Bombil Fry",
    description: "Crispy rava-fried Bombay duck — a Konkan coast favourite.",
    priceCents: qar(28),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.bombilFry),
  },
  {
    name: "Fish Koliwada",
    description: "Koli-style spicy fried fish bites with lemon and onion.",
    priceCents: qar(32),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.fishKoliwada),
  },
  {
    name: "Kombdi Vade",
    description: "Malvani chicken curry with soft, puffed vade made from rice and urad flour.",
    priceCents: qar(35),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.kombdiVade),
  },
  {
    name: "Pithla Bhakri",
    description: "Comforting besan pithla with bhakri, onion and green chilli.",
    priceCents: qar(18),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.pithlaBhakri),
  },
  {
    name: "Misal Pav",
    description: "Spicy sprouted-moth usal topped with farsan, onion and lemon, with pav.",
    priceCents: qar(18),
    category: "Snacks",
    image: commonsPhoto(PHOTOS.misalPav),
  },
  {
    name: "Vada Pav (2 pcs)",
    description: "Batata vada in soft pav with garlic and green chutney.",
    priceCents: qar(10),
    category: "Snacks",
    image: commonsPhoto(PHOTOS.vadaPav),
  },
  {
    name: "Sabudana Vada (4 pcs)",
    description: "Crisp sago and peanut vadas with green chutney.",
    priceCents: qar(14),
    category: "Snacks",
    image: commonsPhoto(PHOTOS.sabudanaVada),
  },
  {
    name: "Ukadiche Modak (4 pcs)",
    description: "Steamed rice-flour modak filled with coconut and jaggery.",
    priceCents: qar(20),
    category: "Desserts",
    image: commonsPhoto(PHOTOS.modak),
  },
  {
    name: "Aamras Puran Poli",
    description: "Sweet Alphonso mango pulp with soft puran poli (seasonal).",
    priceCents: qar(22),
    category: "Desserts",
    image: commonsPhoto(PHOTOS.aamrasPuranPoli),
  },
  {
    name: "Solkadhi",
    description: "Cooling kokum and coconut milk drink — the perfect end to a Kokni meal.",
    priceCents: qar(8),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.solkadhi),
  },
  {
    name: "Kokum Sharbat",
    description: "Sweet and tangy kokum cooler, served chilled.",
    priceCents: qar(7),
    category: "Signature Items",
    image: commonsPhoto(PHOTOS.kokumSharbat),
  },
];

/**
 * Menu additions applied once each (tracked in the SeedRun table). Items whose
 * name already exists are skipped, and deleting an item later won't bring it
 * back on the next deploy.
 */
const R = "Snacks";
const MENU_PACKS: { id: string; items: typeof foodItems }[] = [
  {
    id: "ramadan-eid-menu-2026",
    items: [
      { name: "Veg Samosa (12 pcs)", description: "Crisp samosas with a spiced potato and peas filling.", priceCents: qar(30), category: R, image: commonsPhoto(PHOTOS.vegSamosa) },
      { name: "Non-veg Samosa (12 pcs)", description: "Crisp samosas with a spiced minced-meat filling.", priceCents: qar(35), category: R, image: commonsPhoto(PHOTOS.nonVegSamosa) },
      { name: "Dahi Vada (1 CNT)", description: "Soft lentil vadas in sweet yoghurt with tamarind chutney.", priceCents: qar(30), category: R, image: commonsPhoto(PHOTOS.dahiVada) },
      { name: "Cutlets (12 pcs)", description: "Golden, crumb-coated spiced cutlets.", priceCents: qar(35), category: R, image: commonsPhoto(PHOTOS.cutlets) },
      { name: "Vada Pav (6 pcs)", description: "Batata vada in soft pav with garlic and green chutney.", priceCents: qar(30), category: R, image: commonsPhoto(PHOTOS.vadaPav6) },
      { name: "Box Patties (12 pcs)", description: "Flaky puff-pastry patties with a savoury filling.", priceCents: qar(45), category: R, image: commonsPhoto(PHOTOS.boxPatties) },
      { name: "Beef Shami Kebab (12 pcs)", description: "Tender minced beef and chana dal kebabs, pan-fried.", priceCents: qar(45), category: R, image: commonsPhoto(PHOTOS.shamiKebab) },
      { name: "Mutton Shami Kebab (12 pcs)", description: "Melt-in-the-mouth minced mutton and dal kebabs.", priceCents: qar(50), category: R, image: commonsPhoto(PHOTOS.muttonShamiKebab) },
      { name: "Lagda (1 CNT)", description: "Spiced white peas curry, Mumbai style.", priceCents: qar(15), category: R, image: commonsPhoto(PHOTOS.lagda) },
      { name: "Chana Masala (1 CNT)", description: "Chickpeas cooked in a rich onion-tomato masala.", priceCents: qar(15), category: R, image: commonsPhoto(PHOTOS.chanaMasala) },
      { name: "Potato Chat (1 CNT)", description: "Tangy potato chaat with chutneys and spices.", priceCents: qar(15), category: R, image: commonsPhoto(PHOTOS.potatoChaat) },
      { name: "Chicken Sandwiches (6 pcs)", description: "Soft sandwiches with creamy spiced chicken filling.", priceCents: qar(35), category: R, image: commonsPhoto(PHOTOS.chickenSandwich) },
      { name: "Chicken Tandoor Samosa (12 pcs)", description: "Samosas filled with smoky tandoori chicken.", priceCents: qar(40), category: R, image: commonsPhoto(PHOTOS.tandoorSamosa) },
      { name: "Cheese Samosa (12 pcs)", description: "Crisp samosas with a gooey cheese filling.", priceCents: qar(30), category: R, image: commonsPhoto(PHOTOS.cheeseSamosa) },
      { name: "Keema Samosa (12 pcs)", description: "Samosas packed with spiced keema.", priceCents: qar(45), category: R, image: commonsPhoto(PHOTOS.keemaSamosa) },
      { name: "Veg Spring Rolls (12 pcs)", description: "Crispy rolls with stir-fried vegetables.", priceCents: qar(40), category: R, image: commonsPhoto(PHOTOS.vegSpringRolls) },
      { name: "Non-Veg Spring Rolls (12 pcs)", description: "Crispy rolls with a savoury meat filling.", priceCents: qar(40), category: R, image: commonsPhoto(PHOTOS.springRolls) },
      { name: "Chicken Chinese Rolls (12 pcs)", description: "Indo-Chinese style crispy chicken rolls.", priceCents: qar(45), category: R, image: commonsPhoto(PHOTOS.springRolls) },
      { name: "Gola Kebab (6 pcs)", description: "Soft, smoky minced-meat kebabs.", priceCents: qar(45), category: R, image: commonsPhoto(PHOTOS.golaKebab) },
      { name: "Chicken Kofte (12 pcs)", description: "Spiced minced chicken kofte.", priceCents: qar(40), category: R, image: commonsPhoto(PHOTOS.chickenKofte) },
      { name: "Mutton Kofte (12 pcs)", description: "Spiced minced mutton kofte.", priceCents: qar(55), category: R, image: commonsPhoto(PHOTOS.muttonKofte) },
      { name: "Lagda Petis (6 pcs - 1 CNT)", description: "Potato patties served with spiced lagda (white peas curry).", priceCents: qar(30), category: R, image: commonsPhoto(PHOTOS.lagdaPetis) },
      { name: "Chicken Buns (6 pcs)", description: "Soft buns stuffed with spiced chicken.", priceCents: qar(40), category: R, image: commonsPhoto(PHOTOS.chickenBuns) },
      { name: "Tandoori Club Sandwiches (6 pcs)", description: "Layered club sandwiches with tandoori chicken.", priceCents: qar(35), category: R, image: commonsPhoto(PHOTOS.clubSandwich) },
      { name: "Chicken Bread Rolls (12 pcs)", description: "Crisp bread rolls with spiced chicken filling.", priceCents: qar(45), category: R, image: commonsPhoto(PHOTOS.breadRolls) },
      { name: "Chicken Russian Kebab (12 pcs)", description: "Creamy chicken kebabs, crumb-coated and fried.", priceCents: qar(45), category: R, image: commonsPhoto(PHOTOS.cutlets) },
      { name: "Chapli Kebab (12 pcs)", description: "Flat Peshawari-style spiced minced-meat kebabs.", priceCents: qar(40), category: R, image: commonsPhoto(PHOTOS.chapliKebab) },
      { name: "Nuggets (12 pcs)", description: "Crispy golden chicken nuggets.", priceCents: qar(40), category: R, image: commonsPhoto(PHOTOS.nuggets) },

      { name: "Sandan (12 pcs)", description: "Soft, steamed Kokni rice cakes, lightly sweet with a saffron touch.", priceCents: qar(40), category: "Signature Items", image: "/images/sandan.jpg" },
      { name: "Chicken Biryani", description: "Fragrant dum biryani with tender chicken.", priceCents: qar(105), category: "Rice Items", image: commonsPhoto(PHOTOS.chickenBiryani) },
      { name: "Mutton Biryani", description: "Rich dum biryani with slow-cooked mutton.", priceCents: qar(140), category: "Rice Items", image: commonsPhoto(PHOTOS.muttonBiryani) },
      { name: "Mutton Paaya", description: "Slow-cooked mutton trotters in a spiced broth.", priceCents: qar(95), category: "Signature Items", image: commonsPhoto(PHOTOS.paaya) },
      { name: "Beef Paaya", description: "Slow-cooked beef trotters in a spiced broth.", priceCents: qar(85), category: "Signature Items", image: commonsPhoto(PHOTOS.paaya) },

      { name: "Kheer", description: "Creamy rice pudding with cardamom and nuts.", priceCents: qar(35), category: "Desserts", image: commonsPhoto(PHOTOS.kheer) },
      { name: "Biscuit Delight", description: "Layered biscuit and cream dessert.", priceCents: qar(40), category: "Desserts", image: commonsPhoto(PHOTOS.biscuitPudding) },
      { name: "Ghawna (3 full pcs)", description: "Soft, lacy Kokni rice pancakes.", priceCents: qar(50), category: "Desserts", image: commonsPhoto(PHOTOS.ghawna) },
      { name: "Dates Dessert", description: "A rich, sweet dessert made with dates.", priceCents: qar(40), category: "Desserts", image: "" },

      { name: "Chicken Clear Soup", description: "Light, comforting chicken broth.", priceCents: qar(35), category: "Soups", image: commonsPhoto(PHOTOS.chickenClearSoup) },
      { name: "Chinese Soup", description: "Hot and sour Indo-Chinese soup.", priceCents: qar(35), category: "Soups", image: commonsPhoto(PHOTOS.chineseSoup) },
      { name: "Aalni Palni Soup", description: "Traditional spiced Kokni soup.", priceCents: qar(50), category: "Soups", image: commonsPhoto(PHOTOS.aalniPalniSoup) },
      { name: "Seafood Creamy Soup", description: "Creamy soup loaded with seafood.", priceCents: qar(65), category: "Soups", image: commonsPhoto(PHOTOS.seafoodSoup) },
      { name: "Mutton Soup", description: "Hearty mutton shorba with warming spices.", priceCents: qar(70), category: "Soups", image: commonsPhoto(PHOTOS.muttonSoup) },
    ],
  },
];

async function applyMenuPacks() {
  for (const pack of MENU_PACKS) {
    if (await db.seedRun.findUnique({ where: { id: pack.id } })) continue;
    const existing = new Set((await db.foodItem.findMany({ select: { name: true } })).map((f) => f.name));
    const toAdd = pack.items.filter((f) => !existing.has(f.name));
    await db.$transaction([
      db.foodItem.createMany({ data: toAdd }),
      db.seedRun.create({ data: { id: pack.id } }),
    ]);
    console.log(`✔ Added ${toAdd.length} items from menu update "${pack.id}"`);
  }
}

/** Menu sections as of Oct 2026, applied once to databases seeded earlier. */
const CATEGORY_UPDATE_ID = "menu-categories-2026-10";
const OLD_TO_NEW_CATEGORY: Record<string, string> = {
  "Ramadan Special": "Snacks",
  Sweets: "Desserts",
};
const CATEGORY_BY_NAME: Record<string, string> = {
  "Malvani Fish Thali": "Rice Items",
  "Malvani Chicken Thali": "Rice Items",
  "Bangda Curry Plate": "Rice Items",
  "Chicken Biryani": "Rice Items",
  "Mutton Biryani": "Rice Items",
  "Surmai Fry": "Signature Items",
  "Surmai Fry with Kolambi Curry": "Signature Items",
  "Bombil Fry": "Signature Items",
  "Fish Koliwada": "Signature Items",
  "Kombdi Vade": "Signature Items",
  "Pithla Bhakri": "Signature Items",
  "Sandan (12 pcs)": "Signature Items",
  "Mutton Paaya": "Signature Items",
  "Beef Paaya": "Signature Items",
  "Solkadhi": "Signature Items",
  "Kokum Sharbat": "Signature Items",
  "Misal Pav": "Snacks",
  "Vada Pav (2 pcs)": "Snacks",
  "Sabudana Vada (4 pcs)": "Snacks",
  "Ukadiche Modak (4 pcs)": "Desserts",
  "Aamras Puran Poli": "Desserts",
};

/** Any item still in a retired section is moved into the current five. */
const CLEANUP_ID = "menu-categories-cleanup-2026-10b";
const RETIRED_CATEGORY: Record<string, string> = {
  "Eid Special": "Signature Items",
  "Ramadan Special": "Snacks",
  Thali: "Rice Items",
  Seafood: "Signature Items",
  Chicken: "Signature Items",
  Vegetarian: "Signature Items",
  Drinks: "Signature Items",
  Sweets: "Desserts",
};

async function retireOldCategories() {
  if (await db.seedRun.findUnique({ where: { id: CLEANUP_ID } })) return;
  const ops = [
    // Biryanis belong with rice, wherever they were.
    db.foodItem.updateMany({
      where: { name: { contains: "biryani", mode: "insensitive" }, category: { in: Object.keys(RETIRED_CATEGORY) } },
      data: { category: "Rice Items" },
    }),
    ...Object.entries(RETIRED_CATEGORY).map(([from, category]) =>
      db.foodItem.updateMany({ where: { category: from }, data: { category } }),
    ),
  ];
  const results = await db.$transaction([...ops, db.seedRun.create({ data: { id: CLEANUP_ID } })]);
  const moved = results.slice(0, ops.length).reduce((n, r) => n + (r as { count: number }).count, 0);
  console.log(`✔ Retired old menu sections (moved ${moved} items)`);
}

async function applyCategoryUpdate() {
  if (await db.seedRun.findUnique({ where: { id: CATEGORY_UPDATE_ID } })) return;
  const ops = [
    ...Object.entries(CATEGORY_BY_NAME).map(([name, category]) =>
      db.foodItem.updateMany({ where: { name }, data: { category } }),
    ),
    ...Object.entries(OLD_TO_NEW_CATEGORY).map(([from, category]) =>
      db.foodItem.updateMany({
        where: { category: from, name: { notIn: Object.keys(CATEGORY_BY_NAME) } },
        data: { category },
      }),
    ),
  ];
  await db.$transaction([...ops, db.seedRun.create({ data: { id: CATEGORY_UPDATE_ID } })]);
  console.log("✔ Moved menu items into the new sections");
}

const recipes = [
  {
    name: "Solkadhi",
    description: "The pink, cooling kokum and coconut drink served after every Kokni meal.",
    image: commonsPhoto(PHOTOS.solkadhi),
    cookingTime: 25,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "8–10 dried kokum petals",
      "1 cup warm water",
      "2 cups thick coconut milk",
      "1 small garlic clove, crushed",
      "1 green chilli, slit",
      "Salt to taste",
      "Pinch of sugar (optional)",
      "Chopped coriander to garnish",
    ],
    instructions: [
      "Soak the kokum petals in 1 cup warm water for 20 minutes.",
      "Squeeze the petals well into the water to release the colour, then strain.",
      "Stir the kokum water into the coconut milk until it turns a soft pink.",
      "Add the garlic, green chilli, salt and a pinch of sugar. Mix well.",
      "Chill for 10 minutes, garnish with coriander and serve cold.",
    ],
  },
  {
    name: "Kokum Sharbat",
    description: "A quick, refreshing summer cooler made from kokum syrup.",
    image: commonsPhoto(PHOTOS.kokumSharbat),
    cookingTime: 5,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "4 tbsp kokum syrup (agal)",
      "2 cups chilled water",
      "1/2 tsp roasted cumin powder",
      "Pinch of black salt",
      "Ice cubes",
      "Mint leaves to garnish",
    ],
    instructions: [
      "Add the kokum syrup to a jug of chilled water.",
      "Stir in the roasted cumin powder and black salt.",
      "Taste and add a little more syrup if you like it sweeter.",
      "Pour over ice, garnish with mint and serve.",
    ],
  },
  {
    name: "Pithla",
    description: "A comforting besan (gram flour) curry, ready in 15 minutes — perfect with bhakri.",
    image: commonsPhoto(PHOTOS.pithlaBhakri),
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "1/2 cup besan (gram flour)",
      "1 1/2 cups water",
      "1 tbsp oil",
      "1/2 tsp mustard seeds",
      "1/2 tsp cumin seeds",
      "6–8 curry leaves",
      "2 green chillies, chopped",
      "1 small onion, chopped",
      "1/4 tsp turmeric",
      "Salt to taste",
      "Chopped coriander",
    ],
    instructions: [
      "Whisk the besan with the water and a pinch of salt until smooth, with no lumps.",
      "Heat oil in a pan and add mustard and cumin seeds. Let them splutter.",
      "Add curry leaves, green chillies and onion. Cook for 2 minutes until soft.",
      "Add turmeric, then pour in the besan mixture while stirring continuously.",
      "Cook on low heat for 5–7 minutes, stirring, until thick and glossy.",
      "Garnish with coriander and serve hot with bhakri or rice.",
    ],
  },
  {
    name: "Aamras",
    description: "Sweet, silky Alphonso mango pulp — the taste of a Konkan summer.",
    image: commonsPhoto(PHOTOS.aamrasPuranPoli2),
    cookingTime: 10,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "4 ripe Alphonso (hapus) mangoes",
      "1–2 tbsp sugar (only if the mangoes aren't sweet)",
      "1/4 tsp cardamom powder",
      "Pinch of saffron (optional)",
      "2–3 tbsp cold milk (optional)",
    ],
    instructions: [
      "Wash, peel and chop the mangoes, discarding the seeds.",
      "Blend the mango with cardamom (and sugar or milk if using) until smooth.",
      "Stir in the saffron and chill for 20 minutes.",
      "Serve cold with puri or puran poli.",
    ],
  },
  {
    name: "Surmai Rava Fry",
    description: "Crispy, spicy kingfish fry — Konkan coast style, in under 30 minutes.",
    image: commonsPhoto(PHOTOS.surmaiFry),
    cookingTime: 30,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "4 surmai (kingfish) steaks",
      "1 tsp ginger-garlic paste",
      "1 1/2 tsp Malvani masala (or red chilli powder)",
      "1/4 tsp turmeric",
      "1 tsp lemon juice or kokum water",
      "Salt to taste",
      "4 tbsp fine rava (semolina)",
      "1 tbsp rice flour",
      "3 tbsp oil",
    ],
    instructions: [
      "Rinse and pat the fish dry.",
      "Mix ginger-garlic paste, Malvani masala, turmeric, lemon juice and salt. Coat the fish and rest for 15 minutes.",
      "Mix the rava and rice flour on a plate and press each steak into it on both sides.",
      "Shallow fry in hot oil on medium heat for 3–4 minutes per side until golden and crisp.",
      "Serve hot with lemon wedges, onion rings and solkadhi.",
    ],
  },
  {
    name: "Ukadiche Modak",
    description: "Steamed modak with a sweet coconut-jaggery filling — Ganpati's favourite.",
    image: commonsPhoto(PHOTOS.modakPuneri),
    cookingTime: 60,
    servings: 4,
    difficulty: "Medium",
    ingredients: [
      "1 cup fresh grated coconut",
      "3/4 cup grated jaggery",
      "1/4 tsp cardamom powder",
      "1 cup rice flour",
      "1 cup water",
      "1 tsp ghee",
      "Pinch of salt",
    ],
    instructions: [
      "Cook the coconut and jaggery in a pan for 5–7 minutes until sticky. Add cardamom and let it cool.",
      "Boil the water with ghee and salt, add the rice flour, stir, cover and rest for 5 minutes.",
      "Knead the warm dough until smooth, using wet hands.",
      "Flatten a small ball of dough into a cup, fill with the coconut mixture and pinch pleats to close at the top.",
      "Steam the modak on a greased plate or banana leaf for 10–12 minutes.",
      "Serve warm with a spoon of ghee on top.",
    ],
  },
];

/**
 * Earlier versions of this app shipped different sample menus (a generic one,
 * then "KokniSwaad" with illustrations and rupee prices). If that untouched
 * sample data is still in the database, swap it for the current menu once.
 * Items the admin has edited (different image) are left alone, and past orders
 * keep their own copy of names and prices.
 */
const OLD_SAMPLES = [
  {
    food: [
      "Chicken Sandwich",
      "Beef Burger",
      "Chicken Wrap",
      "French Fries",
      "Caesar Salad",
      "Fresh Orange Juice",
      "Bottled Water",
    ],
    recipes: [
      "Fluffy Pancakes",
      "Avocado Toast",
      "Garlic Butter Pasta",
      "Veggie Omelette",
      "Egg Fried Rice",
      "Berry Smoothie",
    ],
    image: { contains: "images.unsplash.com" },
  },
  {
    food: [
      "Malvani Fish Thali",
      "Surmai Fry",
      "Kolambi Masala",
      "Bangda Curry with Rice",
      "Bombil Fry",
      "Kombdi Vade",
      "Pithla Bhakri",
      "Kala Vatana Usal with Vade",
      "Ghavane with Chutney",
      "Kothimbir Vadi",
      "Ukadiche Modak (4 pcs)",
      "Aamras Puri",
      "Solkadhi",
      "Kokum Sharbat",
    ],
    recipes: [
      "Solkadhi",
      "Kokum Sharbat",
      "Ghavane",
      "Kokni Batata Bhaji",
      "Kolambi Fry",
      "Ukadiche Modak",
    ],
    image: { startsWith: "/images/dishes/" },
  },
];

async function replaceOldSamples() {
  let food = 0;
  let recipes = 0;
  for (const old of OLD_SAMPLES) {
    food += (await db.foodItem.deleteMany({ where: { name: { in: old.food }, image: old.image } })).count;
    recipes += (await db.recipe.deleteMany({ where: { name: { in: old.recipes }, image: old.image } })).count;
  }
  if (food || recipes) {
    console.log(`✔ Removed old sample data (${food} food items, ${recipes} recipes)`);
  }
  return { food, recipes };
}

async function main() {
  // Admin user
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  // Optional: move an existing admin to ADMIN_EMAIL (keeps their password).
  const renameFrom = process.env.ADMIN_RENAME_FROM?.trim().toLowerCase();
  if (email && renameFrom && renameFrom !== email) {
    const [from, to] = await Promise.all([
      db.admin.findUnique({ where: { email: renameFrom } }),
      db.admin.findUnique({ where: { email } }),
    ]);
    if (from && !to) {
      await db.admin.update({
        where: { id: from.id },
        // Bumping tokenVersion signs out sessions that used the old email.
        data: { email, tokenVersion: { increment: 1 } },
      });
      console.log(`✔ Changed admin email ${renameFrom} → ${email} (password unchanged)`);
    }
  }
  if (email && password) {
    const existing = await db.admin.findUnique({ where: { email } });
    if (!existing) {
      await db.admin.create({
        data: { email, passwordHash: await bcrypt.hash(password, 12) },
      });
      console.log(`✔ Created admin ${email}`);
    } else if (process.env.ADMIN_RESET_PASSWORD === "true") {
      // One-off reset to ADMIN_PASSWORD. Recorded per (email, password) so a
      // password the admin later changes in Settings isn't overwritten again.
      const runId = `admin-password-reset:${createHash("sha256").update(`${email}\n${password}`).digest("hex").slice(0, 16)}`;
      if (!(await db.seedRun.findUnique({ where: { id: runId } }))) {
        await db.$transaction([
          db.admin.update({
            where: { id: existing.id },
            // Bumping tokenVersion signs out every existing session.
            data: { passwordHash: await bcrypt.hash(password, 12), tokenVersion: { increment: 1 } },
          }),
          db.seedRun.create({ data: { id: runId } }),
        ]);
        console.log(`✔ Reset the password for admin ${email}`);
      } else {
        console.log(`• Admin ${email} password reset already applied`);
      }
    } else {
      console.log(`• Admin ${email} already exists (password unchanged)`);
    }
  } else {
    console.warn("! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin creation");
  }

  const removed = await replaceOldSamples();

  // Fill an empty menu, or top up the sample menu right after replacing an old one
  // (items the admin added themselves are kept; names that already exist are skipped).
  if ((await db.foodItem.count()) === 0 || removed.food > 0) {
    const existing = new Set((await db.foodItem.findMany({ select: { name: true } })).map((f) => f.name));
    const toAdd = foodItems.filter((f) => !existing.has(f.name));
    await db.foodItem.createMany({ data: toAdd });
    console.log(`✔ Added ${toAdd.length} food items`);
  } else {
    console.log("• Food items already present — skipped");
  }

  if ((await db.recipe.count()) === 0 || removed.recipes > 0) {
    const existing = new Set((await db.recipe.findMany({ select: { name: true } })).map((r) => r.name));
    for (const r of recipes.filter((r) => !existing.has(r.name))) {
      await db.recipe.create({
        data: { ...r, ingredients: r.ingredients.join("\n"), instructions: r.instructions.join("\n") },
      });
    }
    console.log(`✔ Added ${recipes.length} recipes`);
  } else {
    console.log("• Recipes already present — skipped");
  }

  await applyMenuPacks();
  await applyCategoryUpdate();
  await retireOldCategories();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
