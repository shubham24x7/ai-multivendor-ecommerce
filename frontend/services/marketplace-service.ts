import { apiClient } from "@/lib/api-client";

export async function createReverseRequest(payload: unknown) {
  const response = await apiClient.post("/reverse-marketplace/requests", payload);
  return response.data.data;
}

export async function getOpenReverseRequests() {
  const response = await apiClient.get("/reverse-marketplace/requests");
  return response.data.data;
}

export async function submitRequestOffer(payload: unknown) {
  const response = await apiClient.post("/reverse-marketplace/offers", payload);
  return response.data.data;
}

export async function getGroupBuys() {
  const response = await apiClient.get("/group-buys");
  return response.data.data;
}

export async function joinGroupBuy(groupId: string, quantity = 1) {
  const response = await apiClient.post(`/group-buys/${groupId}/join`, { quantity });
  return response.data.data;
}

export async function startNegotiation(payload: unknown) {
  const response = await apiClient.post("/negotiations", payload);
  return response.data.data;
}

export async function getNegotiationSuggestion(negotiationId: string) {
  const response = await apiClient.post(`/negotiations/${negotiationId}/suggest`);
  return response.data.data;
}

export async function getAnalytics(scope: "buyer" | "seller" | "admin") {
  const response = await apiClient.get(`/analytics/${scope}`);
  return response.data.data;
}
