import { ChatWidget } from "@/components/chat-widget";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {children}
      
      <ChatWidget />
    </div>
  );
}