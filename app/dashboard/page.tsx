'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

interface Lead {
  id: string;
  fullName: string;
  mobile: string;
  engineModel: string;
  city: string;
  usageType?: string;
  additionalNotes?: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/dashboard/login');
      return;
    }

    fetchLeads();
  }, [session, status, router]);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();
      
      if (data.leads) {
        setLeads(data.leads);
        
        // Calculate stats
        const total = data.leads.length;
        const newLeads = data.leads.filter((lead: Lead) => lead.status === 'NEW').length;
        const contacted = data.leads.filter((lead: Lead) => lead.status === 'CONTACTED').length;
        const qualified = data.leads.filter((lead: Lead) => lead.status === 'QUALIFIED').length;
        
        setStats({ total, new: newLeads, contacted, qualified });
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      NEW: 'bg-blue-100 text-blue-800',
      CONTACTED: 'bg-yellow-100 text-yellow-800',
      QUALIFIED: 'bg-green-100 text-green-800',
      PROPOSAL_SENT: 'bg-purple-100 text-purple-800',
      NEGOTIATING: 'bg-orange-100 text-orange-800',
      WON: 'bg-green-100 text-green-800',
      LOST: 'bg-red-100 text-red-800',
      FOLLOW_UP: 'bg-gray-100 text-gray-800'
    };

    const statusLabels = {
      NEW: 'جديد',
      CONTACTED: 'تم التواصل',
      QUALIFIED: 'مؤهل',
      PROPOSAL_SENT: 'تم إرسال العرض',
      NEGOTIATING: 'في التفاوض',
      WON: 'تم الإغلاق',
      LOST: 'خسارة',
      FOLLOW_UP: 'متابعة'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status as keyof typeof statusColors]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="mt-2 text-gray-600">إدارة العملاء المحتملين ومتابعة المبيعات</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-users text-gray-400 text-2xl"></i>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">إجمالي العملاء</dt>
                    <dd className="text-3xl font-bold text-gray-900">{stats.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-star text-blue-400 text-2xl"></i>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">عملاء جدد</dt>
                    <dd className="text-3xl font-bold text-blue-600">{stats.new}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-phone text-yellow-400 text-2xl"></i>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">تم التواصل</dt>
                    <dd className="text-3xl font-bold text-yellow-600">{stats.contacted}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle text-green-400 text-2xl"></i>
                </div>
                <div className="mr-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">عملاء مؤهلون</dt>
                    <dd className="text-3xl font-bold text-green-600">{stats.qualified}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">العملاء المحتملون</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">قائمة بجميع طلبات الأسعار الواردة من الموقع</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    العميل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الجوال
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المحرك
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المدينة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الاستخدام
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الحالة
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    التاريخ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.fullName}</div>
                      {lead.additionalNotes && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {lead.additionalNotes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.mobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.engineModel}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.usageType || 'غير محدد'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString('ar-SA')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {leads.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-inbox text-gray-400 text-4xl mb-4"></i>
              <p className="text-gray-500">لا توجد طلبات أسعار حتى الآن</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
