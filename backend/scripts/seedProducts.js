import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.js";

dotenv.config();

const sampleProducts = [
  // Fresh Vegetables
  {
    title: "Fresh Farm Red Tomatoes",
    link: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80",
    rate: 35,
    category: "vegetables",
    description: "Juicy, hand-picked farm fresh ripe red tomatoes. Ideal for salads, gravies, and soups.",
    stock: 150,
  },
  {
    title: "Organic Red Onions",
    link: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
    rate: 45,
    category: "vegetables",
    description: "Premium quality crisp red onions with strong aroma and rich flavor. 1kg pack.",
    stock: 200,
  },
  {
    title: "Mountain Fresh Potatoes",
    link: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80",
    rate: 38,
    category: "vegetables",
    description: "Naturally grown, firm and dirt-free golden potatoes. Perfect for curries, fries, and roasts.",
    stock: 180,
  },
  {
    title: "Crunchy Baby Carrots",
    link: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80",
    rate: 48,
    category: "vegetables",
    description: "Sweet, crunchy and vitamin A-rich orange carrots, washed and ready for snacking or cooking.",
    stock: 90,
  },
  {
    title: "Fresh Green Capsicum",
    link: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80",
    rate: 60,
    category: "vegetables",
    description: "Glossy, thick-walled bell peppers packed with crunch and antioxidants.",
    stock: 75,
  },
  {
    title: "Snow White Cauliflower",
    link: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=600&auto=format&fit=crop&q=80",
    rate: 40,
    category: "vegetables",
    description: "Tender, pesticide-free fresh cauliflower heads directly harvested from local organic farms.",
    stock: 80,
  },
  {
    title: "Tender Lady's Finger (Bhindi)",
    link: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80",
    rate: 42,
    category: "vegetables",
    description: "Fresh green, tender okra / lady finger pods, quick to cook and full of dietary fiber.",
    stock: 95,
  },
  {
    title: "Crisp Green Cucumber",
    link: "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=600&auto=format&fit=crop&q=80",
    rate: 28,
    category: "vegetables",
    description: "Hydrating, crisp salad cucumbers harvested fresh in the morning.",
    stock: 110,
  },

  // Leafy Greens
  {
    title: "Organic Farm Spinach (Palak)",
    link: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80",
    rate: 25,
    category: "leafy greens",
    description: "Iron-rich, chemical-free fresh spinach bunch. Washed and tied fresh.",
    stock: 60,
  },
  {
    title: "Aromatic Fresh Coriander (Kothmir)",
    link: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80",
    rate: 15,
    category: "leafy greens",
    description: "Fragrant green coriander bunch for garnishing and chutney preparation.",
    stock: 120,
  },
  {
    title: "Fresh Mint Leaves (Pudina)",
    link: "https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600&auto=format&fit=crop&q=80",
    rate: 15,
    category: "leafy greens",
    description: "Intensely aromatic fresh mint leaves, perfect for teas, juices, and biryani.",
    stock: 90,
  },
  {
    title: "Organic Fenugreek Leaves (Methi)",
    link: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    rate: 20,
    category: "leafy greens",
    description: "Tender green methi leaves packed with medicinal properties and earthy flavor.",
    stock: 70,
  },

  // Exotic & Herbs
  {
    title: "Fresh Green Broccoli",
    link: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600&auto=format&fit=crop&q=80",
    rate: 95,
    category: "exotic",
    description: "Superfood broccoli florets, loaded with fiber, vitamins K and C.",
    stock: 45,
  },
  {
    title: "Fresh Button Mushrooms",
    link: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=600&auto=format&fit=crop&q=80",
    rate: 65,
    category: "exotic",
    description: "Plump, clean white button mushrooms packed in a protective 200g tray.",
    stock: 50,
  },
  {
    title: "Fresh Ginger & Country Garlic Combo",
    link: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80",
    rate: 55,
    category: "exotic",
    description: "Aromatic spicy ginger (250g) and pungent country garlic (250g) pack.",
    stock: 80,
  },

  // Organic Fruits
  {
    title: "Royal Shimla Red Apples",
    link: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
    rate: 140,
    category: "fruits",
    description: "Sweet, juicy and naturally waxed crisp Shimla apples. 1kg pack (4-5 pcs).",
    stock: 65,
  },
  {
    title: "Organic Robusta Bananas",
    link: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80",
    rate: 45,
    category: "fruits",
    description: "Naturally ripened, energy-packed fresh bananas. 1 Dozen.",
    stock: 100,
  },
  {
    title: "Nagpur Sweet Oranges",
    link: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&auto=format&fit=crop&q=80",
    rate: 90,
    category: "fruits",
    description: "Juicy, citrus-burst oranges rich in Vitamin C. 1kg pack.",
    stock: 75,
  },
  {
    title: "Ruby Red Pomegranate",
    link: "https://images.unsplash.com/photo-1541344999736-83eca872f242?w=600&auto=format&fit=crop&q=80",
    rate: 160,
    category: "fruits",
    description: "Sweet, antioxidant-dense ruby pomegranate arils. 1kg pack.",
    stock: 55,
  },

  // Dairy & Farm Fresh
  {
    title: "Farm Fresh Cow Milk (1 Litre)",
    link: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    rate: 40,
    category: "dairy",
    description: "Pure, unadulterated grass-fed pasteurized whole cow milk delivered chilled.",
    stock: 90,
  },
  {
    title: "Fresh Malai Paneer (200g)",
    link: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80",
    rate: 85,
    category: "dairy",
    description: "Soft, melt-in-mouth cottage cheese crafted from pure milk. High protein.",
    stock: 40,
  },
  {
    title: "Farm Country Brown Eggs (Pack of 6)",
    link: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80",
    rate: 55,
    category: "dairy",
    description: "Nutritious free-range country eggs with deep golden yolks.",
    stock: 80,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Remove existing products and insert new rich sample catalog
    await Product.deleteMany({});
    console.log("Cleared old products.");

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${inserted.length} fresh products!`);

    await mongoose.disconnect();
    console.log("Disconnected from DB.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
