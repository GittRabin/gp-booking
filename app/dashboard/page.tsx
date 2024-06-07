import DashboardView from '@/components/DashboardView';
import Header from '@/components/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  return (
    <div>
      <Header />
      <DashboardView />
    </div>
  );
}
