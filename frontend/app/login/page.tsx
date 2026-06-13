import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MainLayout } from "@/components/layout/main-layout";

export default function LoginPage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-10">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input type="email" placeholder="Email address" />
            <Input type="password" placeholder="Password" />
            <Button>Login</Button>
            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link href="/register" className="font-medium text-primary">
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </MainLayout>
  );
}
