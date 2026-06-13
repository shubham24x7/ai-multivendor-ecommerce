import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { dashboardLinks } from "@/lib/constants";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      title="Admin Dashboard"
      description="Moderate sellers, users, products, payments, AI usage, and platform operations."
      links={dashboardLinks.admin}
    >
      {children}
    </DashboardLayout>
  );
}
