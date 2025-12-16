// app/shop/layout.tsx

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 min-h-screen">
      {children}
    </div>
  );
}