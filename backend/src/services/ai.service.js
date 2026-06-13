import mongoose from "mongoose";
import { AiLog } from "../models/ai-log.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";
import { AppError } from "../utils/app-error.js";
import { parseJsonFromText } from "../utils/json.js";
import { logger } from "../utils/logger.js";
import { getAiProvider } from "./ai-provider.service.js";
import {
  aiPromptVersion,
  comparisonPrompt,
  copilotPrompt,
  descriptionPrompt,
  reviewSummaryPrompt,
  smartSearchPrompt
} from "./ai.prompt.service.js";

function actorMeta(user) {
  return {
    userId: user?._id,
    role: user?.role || "public"
  };
}

async function runAiJson({ user, feature, providerName, prompt, inputMetadata, temperature }) {
  const provider = getAiProvider(providerName);
  const startedAt = Date.now();

  try {
    const response = await provider.generateJson({
      system: prompt.system,
      user: prompt.user,
      temperature
    });
    const parsed = parseJsonFromText(response.text);

    await AiLog.create({
      ...actorMeta(user),
      feature,
      provider: provider.name,
      model: response.model,
      promptVersion: aiPromptVersion,
      inputMetadata,
      outputMetadata: {
        keys: Array.isArray(parsed) ? ["array"] : Object.keys(parsed || {})
      },
      tokenUsage: response.usage,
      latencyMs: Date.now() - startedAt,
      status: "success"
    });

    logger.info("AI request completed", { feature, provider: provider.name, latencyMs: Date.now() - startedAt });
    return parsed;
  } catch (error) {
    await AiLog.create({
      ...actorMeta(user),
      feature,
      provider: provider.name,
      model: provider.model,
      promptVersion: aiPromptVersion,
      inputMetadata,
      latencyMs: Date.now() - startedAt,
      status: "failed",
      errorMessage: error.message
    });

    logger.error("AI request failed", { feature, provider: provider.name, error: error.message });
    throw error;
  }
}

function productContext(product) {
  return {
    productId: product._id.toString(),
    title: product.title,
    price: product.price,
    currency: product.currency,
    category: product.categoryId?.name,
    seller: product.storeId?.name,
    inventoryQuantity: product.inventoryQuantity,
    description: product.shortDescription || product.description,
    location: product.location,
    rating: product.ratingAverage
  };
}

function buildProductFilter(filters = {}) {
  const mongoFilter = { status: "active" };

  if (filters.searchText) {
    mongoFilter.$text = { $search: filters.searchText };
  }

  if (typeof filters.priceMin === "number" || typeof filters.priceMax === "number") {
    mongoFilter.price = {};
    if (typeof filters.priceMin === "number") mongoFilter.price.$gte = filters.priceMin;
    if (typeof filters.priceMax === "number") mongoFilter.price.$lte = filters.priceMax;
  }

  if (filters.currency) {
    mongoFilter.currency = filters.currency;
  }

  if (["global", "hyperlocal", "both"].includes(filters.locationMode)) {
    mongoFilter["location.mode"] = filters.locationMode;
  }

  return mongoFilter;
}

function buildProductSort(sort) {
  if (sort === "price_asc") return { price: 1 };
  if (sort === "price_desc") return { price: -1 };
  if (sort === "newest") return { createdAt: -1 };
  return { createdAt: -1 };
}

export async function generateProductDescription(payload, user) {
  return runAiJson({
    user,
    feature: "description_generator",
    providerName: payload.provider,
    prompt: descriptionPrompt(payload),
    inputMetadata: {
      productName: payload.productName,
      category: payload.category,
      featureCount: payload.features?.length || 0
    },
    temperature: 0.45
  });
}

export async function runSmartSearch(payload, user) {
  const filters = await runAiJson({
    user,
    feature: "smart_search",
    providerName: payload.provider,
    prompt: smartSearchPrompt(payload.query),
    inputMetadata: { query: payload.query },
    temperature: 0.1
  });

  const products = await Product.find(buildProductFilter(filters))
    .populate("storeId", "name slug")
    .populate("categoryId", "name slug")
    .sort(buildProductSort(filters.sort))
    .limit(24);

  return {
    filters,
    products
  };
}

export async function runShoppingCopilot(payload, user) {
  const searchResult = await runSmartSearch(
    {
      query: payload.query,
      provider: payload.provider
    },
    user
  );

  const context = searchResult.products.slice(0, 8).map(productContext);

  if (context.length === 0) {
    return {
      answer: "I could not find matching active products for that request.",
      recommendations: [],
      products: []
    };
  }

  const aiResult = await runAiJson({
    user,
    feature: "shopping_copilot",
    providerName: payload.provider,
    prompt: copilotPrompt(payload.query, context),
    inputMetadata: { query: payload.query, productContextCount: context.length },
    temperature: 0.25
  });

  const validProductIds = new Set(context.map((product) => product.productId));
  const recommendations = (aiResult.recommendations || []).filter((item) =>
    validProductIds.has(item.productId)
  );

  return {
    answer: aiResult.answer,
    recommendations,
    products: searchResult.products
  };
}

export async function compareProducts(payload, user) {
  const productIds = payload.productIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
  if (productIds.length < 2) {
    throw new AppError("At least two valid product IDs are required", 400);
  }

  const products = await Product.find({ _id: { $in: productIds }, status: "active" })
    .populate("storeId", "name slug")
    .populate("categoryId", "name slug")
    .limit(5);

  if (products.length < 2) {
    throw new AppError("At least two active products are required for comparison", 404);
  }

  const result = await runAiJson({
    user,
    feature: "product_comparison",
    providerName: payload.provider,
    prompt: comparisonPrompt(products.map(productContext)),
    inputMetadata: { productIds: products.map((product) => product._id.toString()) },
    temperature: 0.2
  });

  return {
    ...result,
    products
  };
}

export async function summarizeReviews(payload, user) {
  const productId = payload.productId;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Valid productId is required", 400);
  }

  const reviews = await Review.find({ productId, status: "published" })
    .select("rating title comment createdAt")
    .sort({ createdAt: -1 })
    .limit(50);

  if (reviews.length === 0) {
    throw new AppError("No published reviews found for this product", 404);
  }

  return runAiJson({
    user,
    feature: "review_summarizer",
    providerName: payload.provider,
    prompt: reviewSummaryPrompt(reviews),
    inputMetadata: { productId, reviewCount: reviews.length },
    temperature: 0.2
  });
}
