import type { Order } from "@/types/order";
import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "p1",
    slug: "artisan-cotton-tote",
    title: "Artisan Cotton Tote",
    description:
      "A durable everyday tote made by a verified local seller with hand-finished details and roomy storage.",
    price: 34,
    currency: "USD",
    rating: 4.8,
    imageUrl:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    sellerName: "Urban Loom",
    category: "Fashion",
    location: "Hyperlocal",
    inventory: 42,
    aiSummary: "Best for daily carry, gifting, and buyers who prefer sustainable materials."
  },
  {
    id: "p2",
    slug: "smart-home-starter-kit",
    title: "Smart Home Starter Kit",
    description:
      "A compact connected home bundle with voice-ready plugs, sensors, and guided setup from the seller.",
    price: 119,
    currency: "USD",
    rating: 4.6,
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80",
    sellerName: "NestGrid",
    category: "Electronics",
    location: "Global",
    inventory: 16,
    aiSummary: "Strong pick for first-time smart home buyers who want one coordinated bundle."
  },
  {
    id: "p3",
    slug: "ceramic-dinner-set",
    title: "Ceramic Dinner Set",
    description:
      "A twelve-piece glazed ceramic tableware set with neutral tones and dishwasher-safe finishing.",
    price: 86,
    currency: "USD",
    rating: 4.9,
    imageUrl:
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=80",
    sellerName: "Casa North",
    category: "Home",
    location: "Global",
    inventory: 27,
    aiSummary: "A polished option for home upgrades, wedding gifts, and coordinated dining setups."
  }
];

export const orders: Order[] = [
  {
    id: "ORD-10019",
    total: 153,
    currency: "USD",
    status: "processing",
    itemCount: 3,
    createdAt: "2026-06-10"
  },
  {
    id: "ORD-10012",
    total: 72,
    currency: "USD",
    status: "delivered",
    itemCount: 1,
    createdAt: "2026-06-04"
  }
];
