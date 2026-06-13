import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export class GeminiProvider {
  name = "gemini";

  constructor() {
    this.model = env.ai.gemini.model;
  }

  async generateJson({ system, user, temperature = 0.3 }) {
    if (!env.ai.gemini.apiKey) {
      throw new AppError("Gemini API key is not configured", 503);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.ai.requestTimeoutMs);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${env.ai.gemini.apiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          generationConfig: {
            temperature,
            responseMimeType: "application/json"
          },
          contents: [
            {
              role: "user",
              parts: [{ text: `${system}\n\n${user}` }]
            }
          ]
        }),
        signal: controller.signal
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AppError(data.error?.message || "Gemini request failed", response.status);
      }

      return {
        text: data.candidates?.[0]?.content?.parts?.[0]?.text || "{}",
        usage: {
          inputTokens: data.usageMetadata?.promptTokenCount,
          outputTokens: data.usageMetadata?.candidatesTokenCount,
          totalTokens: data.usageMetadata?.totalTokenCount
        },
        model: this.model
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
