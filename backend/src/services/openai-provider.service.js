import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";

export class OpenAiProvider {
  name = "openai";

  constructor() {
    this.model = env.ai.openai.model;
  }

  async generateJson({ system, user, temperature = 0.3 }) {
    if (!env.ai.openai.apiKey) {
      throw new AppError("OpenAI API key is not configured", 503);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.ai.requestTimeoutMs);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.ai.openai.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: this.model,
          temperature,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user }
          ]
        }),
        signal: controller.signal
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AppError(data.error?.message || "OpenAI request failed", response.status);
      }

      return {
        text: data.choices?.[0]?.message?.content || "{}",
        usage: {
          inputTokens: data.usage?.prompt_tokens,
          outputTokens: data.usage?.completion_tokens,
          totalTokens: data.usage?.total_tokens
        },
        model: data.model || this.model
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
