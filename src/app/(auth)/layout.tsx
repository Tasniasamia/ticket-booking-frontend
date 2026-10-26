import { Footer } from "@/components/shared/footer2";
import { Header } from "@/components/shared/header2";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-glow flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
