import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";

export function useCart() {
  const items = useAppSelector((state) => state.cart.items);

  return useMemo(() => {
    const subtotal = items.reduce((total, item) => total + item.product.price * item.quantity, 0);
    const count = items.reduce((total, item) => total + item.quantity, 0);
    return { items, subtotal, count };
  }, [items]);
}
