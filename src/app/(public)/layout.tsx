import { Footer } from "@/components/shared/footer";
import { Header, type HeaderUser } from "@/components/shared/header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // TODO: session cookie থেকে আসল user আনো (Suspense এর ভেতরে, cacheComponents চালু আছে)।
  // লগইন অবস্থা দেখতে এটা বদলে দাও: { name: "Rafiq Ahmed", image: null, role: "user" }
  const user: HeaderUser = null;

  return (
    <div className="page-glow flex min-h-screen flex-col">
      <Header user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
