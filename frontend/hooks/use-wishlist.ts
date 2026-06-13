import { useAppSelector } from "@/store/hooks";

export function useWishlist() {
  return useAppSelector((state) => state.wishlist.items);
}
