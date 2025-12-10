// app/page.tsx
import { getFeaturedProducts } from '@/lib/db';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      
      
      <main>
        
      </main>
      
      
    </div>
  );
}