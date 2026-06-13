import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { GeminiProvider } from "./gemini-provider.service.js";
import { OpenAiProvider } from "./openai-provider.service.js";

const providers = {
  openai: new OpenAiProvider(),
  gemini: new GeminiProvider()
};

export function getAiProvider(providerName) {
  const selected = providerName || env.ai.defaultProvider;
  const provider = providers[selected];

  if (!provider) {
    throw new AppError(`Unsupported AI provider: ${selected}`, 400);
  }

  return provider;
}
