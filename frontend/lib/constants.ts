export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Global Bazaar AI";

export const mainNavItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Groups", href: "/group-buying" },
  { label: "Requests", href: "/reverse-marketplace" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" }
];

export const dashboardLinks = {
  buyer: [
    { label: "Overview", href: "/buyer/dashboard" },
    { label: "Orders", href: "/buyer/dashboard?tab=orders" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Negotiations", href: "/negotiations" },
    { label: "Analytics", href: "/analytics" },
    { label: "Settings", href: "/buyer/dashboard?tab=settings" }
  ],
  seller: [
    { label: "Overview", href: "/seller/dashboard" },
    { label: "Products", href: "/seller/dashboard?tab=products" },
    { label: "Orders", href: "/seller/dashboard?tab=orders" },
    { label: "Group Buying", href: "/group-buying" },
    { label: "Requests", href: "/reverse-marketplace" },
    { label: "Analytics", href: "/analytics" },
    { label: "Store", href: "/seller/dashboard?tab=store" }
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/dashboard?tab=users" },
    { label: "Sellers", href: "/admin/dashboard?tab=sellers" },
    { label: "Analytics", href: "/analytics" },
    { label: "Moderation", href: "/admin/dashboard?tab=moderation" }
  ]
};
