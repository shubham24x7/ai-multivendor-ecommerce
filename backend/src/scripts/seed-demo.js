import { connectDatabase, disconnectDatabase } from "../config/database.js";
import { Category } from "../models/category.model.js";
import { GroupBuy } from "../models/group-buy.model.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { Store } from "../models/store.model.js";
import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/password.js";

const demoPassword = await hashPassword("DemoPass123");

await connectDatabase();

const buyer = await User.findOneAndUpdate(
  { email: "buyer@example.com" },
  {
    name: "Demo Buyer",
    email: "buyer@example.com",
    passwordHash: demoPassword,
    role: "buyer",
    status: "active",
    emailVerified: true
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const sellerUser = await User.findOneAndUpdate(
  { email: "seller@example.com" },
  {
    name: "Demo Seller",
    email: "seller@example.com",
    passwordHash: demoPassword,
    role: "seller",
    status: "active",
    emailVerified: true
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const seller = await Seller.findOneAndUpdate(
  { userId: sellerUser._id },
  {
    userId: sellerUser._id,
    businessName: "Demo Commerce Co",
    businessEmail: sellerUser.email,
    approvalStatus: "approved",
    kycStatus: "approved",
    trustScore: 88,
    trustBadge: "gold"
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const store = await Store.findOneAndUpdate(
  { sellerId: seller._id },
  {
    sellerId: seller._id,
    name: "Demo Global Store",
    slug: "demo-global-store",
    description: "Demo seller storefront for development and staging.",
    status: "active",
    defaultCurrency: "USD"
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const category = await Category.findOneAndUpdate(
  { slug: "electronics" },
  { name: "Electronics", slug: "electronics", isActive: true },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

const product = await Product.findOneAndUpdate(
  { storeId: store._id, slug: "smart-home-demo-kit" },
  {
    sellerId: seller._id,
    storeId: store._id,
    categoryId: category._id,
    title: "Smart Home Demo Kit",
    slug: "smart-home-demo-kit",
    description: "A demo smart home bundle used for checkout, group buying, and negotiation testing.",
    shortDescription: "Demo connected home starter kit.",
    price: 120,
    currency: "USD",
    inventoryQuantity: 100,
    status: "active"
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

await GroupBuy.findOneAndUpdate(
  { productId: product._id, status: "active" },
  {
    productId: product._id,
    sellerId: seller._id,
    title: "Smart Home Demo Group Buy",
    basePrice: product.price,
    currentPrice: product.price,
    currency: product.currency,
    targetQuantity: 10,
    currentQuantity: 0,
    discountTiers: [
      { minQuantity: 5, discountPercent: 8 },
      { minQuantity: 10, discountPercent: 15 }
    ],
    endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "active"
  },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

console.log("Demo data seeded");
console.log("Buyer: buyer@example.com / DemoPass123");
console.log("Seller: seller@example.com / DemoPass123");
console.log(`Buyer id: ${buyer._id}`);

await disconnectDatabase();
