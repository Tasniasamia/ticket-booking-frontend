import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";

// Payment result page গুলো (success / failed / cancel) public layout এর বাইরে ছিল, তাই theme মেলাতে এই layout।
export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-glow flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
