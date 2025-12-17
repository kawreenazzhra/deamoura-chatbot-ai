import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Langsung lempar user ke halaman products
  redirect('/admin/products');
}