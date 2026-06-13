export type OrderStatus = "placed" | "processing" | "shipped" | "delivered";

export type Order = {
  id: string;
  total: number;
  currency: string;
  status: OrderStatus;
  itemCount: number;
  createdAt: string;
};
