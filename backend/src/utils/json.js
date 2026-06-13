export function parseJsonFromText(text) {
  if (!text || typeof text !== "string") {
    throw new Error("AI response was empty");
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!match) {
      throw new Error("AI response did not contain JSON");
    }

    return JSON.parse(match[0]);
  }
}
