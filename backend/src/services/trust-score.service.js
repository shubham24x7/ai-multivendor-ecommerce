import { Order } from "../models/order.model.js";
import { Review } from "../models/review.model.js";
import { Seller } from "../models/seller.model.js";

function badgeForScore(score) {
  if (score >= 90) return "platinum";
  if (score >= 75) return "gold";
  if (score >= 60) return "silver";
  return "bronze";
}

export async function recalculateSellerTrustScore(sellerId) {
  const [totalOrders, fulfilledOrders, returnedOrders, reviews] = await Promise.all([
    Order.countDocuments({ "items.sellerId": sellerId }),
    Order.countDocuments({ "items.sellerId": sellerId, orderStatus: { $in: ["delivered", "completed"] } }),
    Order.countDocuments({ "items.sellerId": sellerId, orderStatus: "returned" }),
    Review.find({ sellerId, status: "published" }).select("rating")
  ]);

  const fulfillmentRate = totalOrders ? fulfilledOrders / totalOrders : 1;
  const returnRate = totalOrders ? returnedOrders / totalOrders : 0;
  const reviewScore = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length / 5 : 0.8;
  const deliveryScore = fulfillmentRate;
  const score = Math.round((fulfillmentRate * 0.35 + (1 - returnRate) * 0.2 + reviewScore * 0.3 + deliveryScore * 0.15) * 100);

  const seller = await Seller.findByIdAndUpdate(
    sellerId,
    {
      trustScore: score,
      trustBadge: badgeForScore(score),
      trustMetrics: {
        fulfillmentRate,
        returnRate,
        reviewScore,
        deliveryScore
      }
    },
    { new: true }
  );

  return seller;
}
