/**
 * Seeds the database with sample menu items, easy recipes and the admin user.
 * Run with: npm run db:seed   (safe to re-run — it only fills empty tables)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const img = (id: string) => `https://images.unsplash.com/${id}?w=800&q=75&auto=format&fit=crop`;

const foodItems = [
  {
    name: "Chicken Sandwich",
    description: "Crispy chicken breast, lettuce, pickles and house mayo on a toasted brioche bun.",
    priceCents: 500,
    category: "Sandwiches",
    image: img("photo-1606755962773-d324e0a13086"),
  },
  {
    name: "Beef Burger",
    description: "Juicy beef patty, cheddar, tomato, onion and our signature sauce.",
    priceCents: 750,
    category: "Burgers",
    image: img("photo-1568901346375-23c9450c58cd"),
  },
  {
    name: "Chicken Wrap",
    description: "Grilled chicken, crunchy salad and garlic yoghurt wrapped in a warm tortilla.",
    priceCents: 600,
    category: "Wraps",
    image: img("photo-1626700051175-6818013e1d4f"),
  },
  {
    name: "French Fries",
    description: "Golden, crispy and lightly salted.",
    priceCents: 300,
    category: "Sides",
    image: img("photo-1573080496219-bb080dd4f877"),
  },
  {
    name: "Caesar Salad",
    description: "Romaine, parmesan, croutons and creamy Caesar dressing.",
    priceCents: 400,
    category: "Salads",
    image: img("photo-1550304943-4f24f54ddde9"),
  },
  {
    name: "Fresh Orange Juice",
    description: "Freshly squeezed oranges. Nothing else.",
    priceCents: 300,
    category: "Drinks",
    image: img("photo-1600271886742-f049cd451bba"),
  },
  {
    name: "Bottled Water",
    description: "Still mineral water, 500 ml.",
    priceCents: 150,
    category: "Drinks",
    image: img("photo-1523362628745-0c100150b504"),
  },
];

const recipes = [
  {
    name: "Fluffy Pancakes",
    description: "Light, golden pancakes ready in 20 minutes — perfect for a lazy breakfast.",
    image: img("photo-1567620905732-2d1ec7ab7445"),
    cookingTime: 20,
    servings: 4,
    difficulty: "Easy",
    ingredients: [
      "1 cup (125 g) plain flour",
      "1 tbsp sugar",
      "2 tsp baking powder",
      "Pinch of salt",
      "1 cup (240 ml) milk",
      "1 egg",
      "2 tbsp melted butter",
    ],
    instructions: [
      "Whisk the flour, sugar, baking powder and salt in a bowl.",
      "In another bowl, whisk the milk, egg and melted butter.",
      "Pour the wet mix into the dry mix and stir until just combined — a few lumps are fine.",
      "Heat a lightly oiled pan over medium heat.",
      "Pour 1/4 cup of batter per pancake. Flip when bubbles appear, about 2 minutes per side.",
      "Serve warm with maple syrup or fresh fruit.",
    ],
  },
  {
    name: "Avocado Toast",
    description: "Creamy avocado on crunchy toast with a squeeze of lemon and chilli flakes.",
    image: img("photo-1541519227354-08fa5d50c44d"),
    cookingTime: 10,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 slices sourdough bread",
      "1 ripe avocado",
      "1/2 lemon",
      "Salt and black pepper",
      "Chilli flakes (optional)",
      "Olive oil",
    ],
    instructions: [
      "Toast the bread until golden.",
      "Mash the avocado with lemon juice, salt and pepper.",
      "Spread the avocado over the toast.",
      "Finish with a drizzle of olive oil and chilli flakes.",
    ],
  },
  {
    name: "Garlic Butter Pasta",
    description: "A five-ingredient weeknight pasta that tastes far better than it should.",
    image: img("photo-1621996346565-e3dbc646d9a9"),
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "200 g spaghetti",
      "3 tbsp butter",
      "4 garlic cloves, finely chopped",
      "Handful of parsley, chopped",
      "40 g grated parmesan",
      "Salt and pepper",
    ],
    instructions: [
      "Cook the spaghetti in salted boiling water until al dente. Save a cup of pasta water.",
      "Melt the butter in a pan over low heat and gently cook the garlic for 1–2 minutes.",
      "Add the drained pasta and a splash of pasta water; toss well.",
      "Stir in the parmesan and parsley. Season and serve immediately.",
    ],
  },
  {
    name: "Veggie Omelette",
    description: "A protein-packed omelette loaded with colourful vegetables.",
    image: img("photo-1510693206972-df098062cb71"),
    cookingTime: 12,
    servings: 1,
    difficulty: "Easy",
    ingredients: [
      "3 eggs",
      "2 tbsp milk",
      "1/4 bell pepper, diced",
      "Handful of spinach",
      "2 mushrooms, sliced",
      "2 tbsp grated cheese",
      "1 tsp butter",
      "Salt and pepper",
    ],
    instructions: [
      "Whisk the eggs, milk, salt and pepper.",
      "Melt the butter in a non-stick pan and cook the vegetables for 2–3 minutes.",
      "Pour in the eggs and let them set gently, lifting the edges as they cook.",
      "Sprinkle over the cheese, fold in half and slide onto a plate.",
    ],
  },
  {
    name: "Egg Fried Rice",
    description: "Turn leftover rice into a quick, satisfying meal in one pan.",
    image: img("photo-1603133872878-684f208fb84b"),
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "2 cups cooked rice (preferably day-old)",
      "2 eggs",
      "1 cup frozen peas and carrots",
      "2 spring onions, sliced",
      "2 tbsp soy sauce",
      "1 tbsp vegetable oil",
      "1 tsp sesame oil",
    ],
    instructions: [
      "Heat the vegetable oil in a large pan or wok over high heat.",
      "Add the peas and carrots and stir-fry for 2 minutes.",
      "Push the veg aside, crack in the eggs and scramble.",
      "Add the rice and soy sauce and stir-fry for 3–4 minutes.",
      "Finish with sesame oil and spring onions.",
    ],
  },
  {
    name: "Berry Smoothie",
    description: "A bright, refreshing smoothie that takes five minutes.",
    image: img("photo-1505252585461-04db1eb84625"),
    cookingTime: 5,
    servings: 2,
    difficulty: "Easy",
    ingredients: [
      "1 cup frozen mixed berries",
      "1 banana",
      "1 cup (240 ml) milk or almond milk",
      "1/2 cup Greek yoghurt",
      "1 tsp honey",
    ],
    instructions: [
      "Add everything to a blender.",
      "Blend until smooth, about 1 minute.",
      "Taste, add more honey if you like, and serve.",
    ],
  },
];

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
