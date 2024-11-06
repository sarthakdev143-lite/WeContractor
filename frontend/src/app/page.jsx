'use client'

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import EmailVerification from '../components/EmailVerification';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  return (
    <section className="flex flex-wrap gap-20 h-fit translate-y-12 p-6 transform justify-center items-center">
      <Link href="/buy"
        className="text-3xl font-semibold py-10 px-20 bg-green-500 hover:bg-green-600 rounded-lg shadow-lg transition-all duration-300"
      >
        Buy
      </Link>
      <Link href="/sell"
        className="text-3xl font-semibold py-10 px-20 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg transition-all duration-300"
      >
        Sell
      </Link>
    </section>
  );
}

const Page = () => {
  return (
    <Suspense fallback={<LoadingSpinner
      type='wave'
    />}>
      <PageContent />
    </Suspense>
  );
}

const PageContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  if (!token) return <Home />;
  return <EmailVerification token={token} />;
}

export default Page;