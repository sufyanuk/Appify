/**
 * Seeds the database with the KokniSwaad sample menu, easy Kokni recipes and
 * the admin user. Run with: npm run db:seed   (safe to re-run — it only fills
 * empty tables, so your own edits are never overwritten)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

/** Built-in illustrations live in public/images/dishes. */
const art = (name: string) => `/images/dishes/${name}.svg`;

// Prices are in paise (₹1 = 100 paise).
const foodItems = [
  {
    name: "Malvani Fish Thali",
    description: "Surmai fry, Malvani fish curry, solkadhi, rice and tandlachi bhakri.",
    priceCents: 35000,
    category: "Thali",
    image: art("malvani-fish-thali"),
  },
  {
    name: "Surmai Fry",
    description: "Kingfish steaks in a spicy Malvani masala, shallow-fried in a rava crust.",
    priceCents: 32000,
    category: "Seafood",
    image: art("surmai-fry"),
  },
  {
    name: "Kolambi Masala",
    description: "Prawns simmered in a rich coconut and Malvani masala gravy.",
    priceCents: 30000,
    category: "Seafood",
    image: art("kolambi-masala"),
  },
  {
    name: "Bangda Curry with Rice",
    description: "Mackerel in a tangy kokum and coconut curry, served with steamed rice.",
    priceCents: 24000,
    category: "Seafood",
    image: art("bangda-curry"),
  },
  {
    name: "Bombil Fry",
    description: "Crispy rava-fried Bombay duck — a Konkan coast favourite.",
    priceCents: 22000,
    category: "Seafood",
    image: art("bombil-fry"),
  },
  {
    name: "Kombdi Vade",
    description: "Malvani chicken curry with soft, puffed vade made from rice and urad flour.",
    priceCents: 28000,
    category: "Chicken",
    image: art("kombdi-vade"),
  },
  {
    name: "Pithla Bhakri",
    description: "Comforting besan pithla with jowar bhakri, onion and green chilli.",
    priceCents: 15000,
    category: "Vegetarian",
    image: art("pithla-bhakri"),
  },
  {
    name: "Kala Vatana Usal with Vade",
    description: "Black peas in roasted coconut masala with two Malvani vade.",
    priceCents: 16000,
    category: "Vegetarian",
    image: art("kala-vatana-usal"),
  },
  {
    name: "Ghavane with Chutney",
    description: "Soft, lacy rice-flour pancakes with fresh coconut chutney.",
    priceCents: 9000,
    category: "Snacks",
    image: art("ghavane-chutney"),
  },
  {
    name: "Kothimbir Vadi",
    description: "Crisp coriander and besan squares with green chutney.",
    priceCents: 10000,
    category: "Snacks",
    image: art("kothimbir-vadi"),
  },
  {
    name: "Ukadiche Modak (4 pcs)",
    description: "Steamed rice-flour modak filled with coconut and jaggery.",
    priceCents: 16000,
    category: "Sweets",
    image: art("ukadiche-modak"),
  },
  {
    name: "Aamras Puri",
    description: "Sweet Alphonso mango pulp with two hot puris (seasonal).",
    priceCents: 12000,
    category: "Sweets",
    image: art("aamras-puri"),
  },
  {
    name: "Solkadhi",
    description: "Cooling kokum and coconut milk drink — the perfect end to a Kokni meal.",
    priceCents: 6000,
    category: "Drinks",
    image: art("solkadhi"),
  },
  {
    name: "Kokum Sharbat",
    description: "Sweet and tangy kokum cooler, served chilled.",
    priceCents: 5000,
    category: "Drinks",
    image: art("kokum-sharbat"),
  },
];

const recipes = [
  {
    name: "Solkadhi",
    description: "The pink, cooling kokum and coconut drink served after every Kokni meal.",
    image: art("solkadhi"),
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
    image: art("kokum-sharbat"),
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
    name: "Ghavane",
    description: "Soft, lacy Konkan rice-flour pancakes — ready in 15 minutes.",
    image: art("ghavane-chutney"),
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "1 cup rice flour",
      "1 1/4 cups water (approx.)",
      "Salt to taste",
      "1/4 tsp cumin seeds (optional)",
      "Oil or ghee for the pan",
    ],
    instructions: [
      "Whisk the rice flour, salt and cumin with water into a thin, lump-free batter.",
      "Heat a non-stick tawa on medium and grease it lightly.",
      "Pour a ladle of batter from the edges inward so it spreads into a thin, lacy pancake.",
      "Cover and cook for 1–2 minutes until the top is set. No need to flip.",
      "Serve hot with coconut chutney or a little ghee and jaggery.",
    ],
  },
  {
    name: "Kokni Batata Bhaji",
    description: "Simple potato bhaji with mustard, curry leaves and fresh coconut.",
    image: art("batata-bhaji"),
    cookingTime: 20,
    servings: 3,
    difficulty: "Easy",
    ingredients: [
      "3 potatoes, boiled and cubed",
      "1 tbsp oil",
      "1/2 tsp mustard seeds",
      "8–10 curry leaves",
      "2 green chillies, chopped",
      "1/4 tsp turmeric",
      "2 tbsp fresh grated coconut",
      "Salt to taste",
      "Chopped coriander",
    ],
    instructions: [
      "Heat oil in a kadhai and add mustard seeds. Let them splutter.",
      "Add curry leaves, green chillies and turmeric. Stir for a few seconds.",
      "Add the potatoes and salt and toss gently for 3–4 minutes.",
      "Mix in the grated coconut and coriander.",
      "Serve hot with bhakri, chapati or as a side with varan bhaat.",
    ],
  },
  {
    name: "Kolambi Fry",
    description: "Spicy, crispy prawn fry — Konkan coast style.",
    image: art("kolambi-fry"),
    cookingTime: 25,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "250 g prawns, cleaned and deveined",
      "1 tsp ginger-garlic paste",
      "1 tsp Malvani masala (or red chilli powder)",
      "1/4 tsp turmeric",
      "1 tsp lemon juice",
      "Salt to taste",
      "3 tbsp fine rava (semolina)",
      "2 tbsp oil",
    ],
    instructions: [
      "Mix the prawns with ginger-garlic paste, Malvani masala, turmeric, lemon juice and salt.",
      "Leave to marinate for 15 minutes.",
      "Roll each prawn in rava to coat.",
      "Shallow fry in hot oil for 2–3 minutes per side until crisp and golden.",
      "Serve hot with lemon wedges and onion rings.",
    ],
  },
  {
    name: "Ukadiche Modak",
    description: "Steamed modak with a sweet coconut-jaggery filling — Ganpati's favourite.",
    image: art("ukadiche-modak"),
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
 * The very first version of this app shipped a generic sample menu. If that
 * untouched sample data is still in the database, swap it for the KokniSwaad
 * menu once. Items the admin has edited (different image) are left alone, and
 * past orders keep their own copy of names and prices.
 */
const LEGACY_SAMPLE_FOOD = [
  "Chicken Sandwich",
  "Beef Burger",
  "Chicken Wrap",
  "French Fries",
  "Caesar Salad",
  "Fresh Orange Juice",
  "Bottled Water",
];
const LEGACY_SAMPLE_RECIPES = [
  "Fluffy Pancakes",
  "Avocado Toast",
  "Garlic Butter Pasta",
  "Veggie Omelette",
  "Egg Fried Rice",
  "Berry Smoothie",
];
const legacyImage = { contains: "images.unsplash.com" };

async function replaceLegacySamples() {
  const food = await db.foodItem.deleteMany({
    where: { name: { in: LEGACY_SAMPLE_FOOD }, image: legacyImage },
  });
  const recipe = await db.recipe.deleteMany({
    where: { name: { in: LEGACY_SAMPLE_RECIPES }, image: legacyImage },
  });
  if (food.count || recipe.count) {
    console.log(`✔ Removed old sample data (${food.count} food items, ${recipe.count} recipes)`);
  }
}

async function main() {
  // Admin user
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existing = await db.admin.findUnique({ where: { email } });
    if (!existing) {
      await db.admin.create({
        data: { email, passwordHash: await bcrypt.hash(password, 12) },
      });
      console.log(`✔ Created admin ${email}`);
    } else {
      console.log(`• Admin ${email} already exists (password unchanged)`);
    }
  } else {
    console.warn("! ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin creation");
  }

  await replaceLegacySamples();

  if ((await db.foodItem.count()) === 0) {
    await db.foodItem.createMany({ data: foodItems });
    console.log(`✔ Added ${foodItems.length} food items`);
  } else {
    console.log("• Food items already present — skipped");
  }

  if ((await db.recipe.count()) === 0) {
    for (const r of recipes) {
      await db.recipe.create({
        data: { ...r, ingredients: r.ingredients.join("\n"), instructions: r.instructions.join("\n") },
      });
    }
    console.log(`✔ Added ${recipes.length} recipes`);
  } else {
    console.log("• Recipes already present — skipped");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
