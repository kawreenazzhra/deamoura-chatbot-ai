// app/shop/layout.tsx
import { ChatWidget } from "@/components/chat-widget";
import { getFeaturedProducts } from "@/lib/db";
import { ProductList } from "@/components/product-list";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch produk dari database (server component)
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 min-h-screen">
      {children}
      
      {/* Komponen produk yang menggunakan data dari database */}
      <ProductList initialProducts={featuredProducts} />
      
      <ChatWidget />
    </div>
  );
}