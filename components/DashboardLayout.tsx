'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex-shrink-0">
                <Image
                  src="https://www.tohatsu.com/all/logo_allTop.png"
                  alt="توهاتسو"
                  width={120}
                  height={48}
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden md:mr-6 md:flex md:space-x-8 md:space-x-reverse">
                <Link
                  href="/dashboard"
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  <i className="fas fa-home ml-2"></i>
                  الرئيسية
                </Link>
                <Link
                  href="/dashboard/leads"
                  className="text-gray-500 hover:text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  <i className="fas fa-users ml-2"></i>
                  العملاء المحتملون
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-sm text-gray-700">مرحباً، {session?.user?.name}</span>
                <button
                  onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <i className="fas fa-sign-out-alt ml-2"></i>
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}
