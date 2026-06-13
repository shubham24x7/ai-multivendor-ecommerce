import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { dashboardLinks } from "@/lib/constants";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      title="Seller Dashboard"
      description="Manage store setup, product listings, orders, inventory, and seller operations."
      links={dashboardLinks.seller}
    >
      {children}
    </DashboardLayout>
  );
}
