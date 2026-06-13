import { AnalyticsEvent } from "../models/analytics-event.model.js";
import { GroupBuy } from "../models/group-buy.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Seller } from "../models/seller.model.js";
import { User } from "../models/user.model.js";

export async function trackEvent(payload, user) {
  return AnalyticsEvent.create({
    ...payload,
    userId: user?._id,
    role: user?.role || "public"
  });
}

export async function buyerAnalytics(userId) {
  const [orders, events] = await Promise.all([
    Order.find({ buyerId: userId }),
    AnalyticsEvent.find({ userId }).sort({ createdAt: -1 }).limit(20)
  ]);

  return {
    orderCount: orders.length,
    totalSpend: orders.reduce((sum, order) => sum + order.grandTotal, 0),
    recentEvents: events
  };
}

export async function sellerAnalytics(userId) {
  const seller = await Seller.findOne({ userId });
  if (!seller) return { revenue: 0, productCount: 0, orderCount: 0, trustScore: 0 };

  const [products, orders] = await Promise.all([
    Product.countDocuments({ sellerId: seller._id }),
    Order.find({ "items.sellerId": seller._id })
  ]);

  return {
    revenue: orders.reduce(
      (sum, order) =>
        sum + order.items.filter((item) => item.sellerId.toString() === seller._id.toString()).reduce((inner, item) => inner + item.unitPrice * item.quantity, 0),
      0
    ),
    productCount: products,
    orderCount: orders.length,
    trustScore: seller.trustScore,
    trustBadge: seller.trustBadge
  };
}

export async function adminAnalytics() {
  const [buyers, sellers, products, orders, activeGroups] = await Promise.all([
    User.countDocuments({ role: "buyer" }),
    Seller.countDocuments(),
    Product.countDocuments(),
    Order.find(),
    GroupBuy.countDocuments({ status: "active" })
  ]);

  return {
    buyers,
    sellers,
    products,
    orders: orders.length,
    grossRevenue: orders.reduce((sum, order) => sum + order.grandTotal, 0),
    activeGroups
  };
}
