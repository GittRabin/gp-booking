import Footer from '@/components/Footer';
import Header from '@/components/Header';
import DoctorRegistration from '@/components/DoctorRegistration';
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
      <DoctorRegistration />
      <Footer />
    </div>
  );
}
