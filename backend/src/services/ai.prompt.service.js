export const aiPromptVersion = "v1";

export function systemPrompt() {
  return [
    "You are the commerce AI layer for a global and hyperlocal multi-vendor marketplace.",
    "Use only the product/review context supplied by the backend.",
    "Do not invent product IDs, prices, inventory, seller names, discounts, or policies.",
    "Return valid JSON only. Do not include markdown fences."
  ].join(" ");
}

export function descriptionPrompt(payload) {
  return {
    system: systemPrompt(),
    user: [
      "Generate an SEO optimized ecommerce product listing draft.",
      `Product name: ${payload.productName}`,
      `Category: ${payload.category}`,
      `Features: ${(payload.features || []).join(", ")}`,
      `Tone: ${payload.tone || "professional and conversion-focused"}`,
      "Return JSON with keys: title, shortDescription, description, bulletPoints, seoTitle, seoDescription, keywords."
    ].join("\n")
  };
}

export function copilotPrompt(query, products) {
  return {
    system: systemPrompt(),
    user: [
      `Buyer query: ${query}`,
      "Relevant marketplace products:",
      JSON.stringify(products),
      "Recommend the best matching products and explain why.",
      "Return JSON with keys: answer, recommendations.",
      "Each recommendation must include productId, title, reason, confidence."
    ].join("\n")
  };
}

export function comparisonPrompt(products) {
  return {
    system: systemPrompt(),
    user: [
      "Compare these products for a buyer.",
      JSON.stringify(products),
      "Return JSON with keys: summary, table, winner.",
      "table must be an array of rows with feature plus one key per product title."
    ].join("\n")
  };
}

export function reviewSummaryPrompt(reviews) {
  return {
    system: systemPrompt(),
    user: [
      "Summarize these verified marketplace reviews.",
      JSON.stringify(reviews),
      "Return JSON with keys: pros, cons, sentiment, summary, ratingInsight.",
      "sentiment must be one of positive, neutral, mixed, negative."
    ].join("\n")
  };
}

export function smartSearchPrompt(query) {
  return {
    system: systemPrompt(),
    user: [
      `Natural language search query: ${query}`,
      "Convert this to safe MongoDB product filters for active marketplace products.",
      "Return JSON with keys: searchText, categoryHint, priceMin, priceMax, currency, locationMode, sort.",
      "sort must be one of relevance, price_asc, price_desc, newest, rating.",
      "Use null for unknown values. Do not return MongoDB operators."
    ].join("\n")
  };
}
