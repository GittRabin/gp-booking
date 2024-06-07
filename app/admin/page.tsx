import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AdminRegistration from '@/components/AdminRegistration';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }
  return (
    <div>
      <Header />
      <AdminRegistration />
      <Footer />
    </div>
  );
}
