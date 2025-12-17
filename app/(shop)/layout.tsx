// app/shop/layout.tsx

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background text-foreground min-h-screen">
      {children}
    </div>
  );
}