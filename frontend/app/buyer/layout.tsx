import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { dashboardLinks } from "@/lib/constants";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      title="Buyer Dashboard"
      description="Track orders, saved products, recommendations, payments, and profile settings."
      links={dashboardLinks.buyer}
    >
      {children}
    </DashboardLayout>
  );
}
