'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BsWealthLockup } from '@/components/brand/bs-wealth-mark';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <main className="ambient-wash relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="motion-rise relative z-10 w-full max-w-sm text-center">
        <div className="mb-6 flex justify-center">
          <BsWealthLockup size="lg" />
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-paper">
          <h1 className="font-display text-xl font-semibold tracking-tight">AIOS Dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Redirecting to operations dashboard...</p>
        </div>
      </div>
    </main>
  );
}
