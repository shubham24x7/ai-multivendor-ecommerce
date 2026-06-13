import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t bg-muted/35">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <p className="text-base font-semibold">{APP_NAME}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A global and hyperlocal marketplace foundation for buyers, sellers, admins,
            AI-assisted shopping, and trusted commerce workflows.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Marketplace</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <Link href="/products">Products</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/cart">Cart</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Dashboards</p>
          <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <Link href="/buyer/dashboard">Buyer</Link>
            <Link href="/seller/dashboard">Seller</Link>
            <Link href="/admin/dashboard">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
