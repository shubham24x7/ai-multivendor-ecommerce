import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";

export default function RegisterPage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input placeholder="Full name" />
            <Input type="email" placeholder="Email address" />
            <Input type="password" placeholder="Password" />
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline">Buyer</Button>
              <Button variant="outline">Seller</Button>
              <Button variant="outline">Admin</Button>
            </div>
            <Button>Register</Button>
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
}
