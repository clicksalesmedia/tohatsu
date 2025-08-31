'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const [customerName, setCustomerName] = useState('');
  const [engineModel, setEngineModel] = useState('');

  useEffect(() => {
    // Get customer details from URL params
    const name = searchParams.get('name');
    const model = searchParams.get('model');
    
    if (name) setCustomerName(decodeURIComponent(name));
    if (model) setEngineModel(decodeURIComponent(model));
    
    // Track thank you page view with Meta Pixel
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'CompleteRegistration', {
        content_name: model ? decodeURIComponent(model) : 'Unknown',
        content_category: 'Engine Quote',
        status: 'completed'
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-blue flex items-center justify-center px-4">
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/hero.webp"
          alt="توهاتسو - خلفية"
          fill
          className="object-cover"
        />
      </div>
      
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check-circle text-green-600 text-4xl"></i>
          </div>
          
          {/* Thank You Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            شكراً لك {customerName && <span className="text-blue-600">{customerName}</span>}!
          </h1>
          
          <div className="text-lg text-gray-600 mb-8 space-y-3">
            <p className="font-semibold">تم استلام طلبك بنجاح</p>
            {engineModel && (
              <p>لطلب عرض سعر لمحرك <span className="text-blue-600 font-semibold">{engineModel}</span></p>
            )}
          </div>
          
          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ماذا بعد؟</h3>
            <div className="space-y-4">
              <div className="flex items-start text-right">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-gray-800">مراجعة الطلب</p>
                  <p className="text-gray-600 text-sm">سيقوم فريقنا بمراجعة طلبك وإعداد أفضل عرض سعر</p>
                </div>
              </div>
              
              <div className="flex items-start text-right">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-gray-800">التواصل معك</p>
                  <p className="text-gray-600 text-sm">سنتواصل معك خلال 24 ساعة عبر الواتساب أو الهاتف</p>
                </div>
              </div>
              
              <div className="flex items-start text-right">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold ml-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-gray-800">عرض السعر</p>
                  <p className="text-gray-600 text-sm">ستحصل على عرض سعر مفصل مع جميع المواصفات</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <p className="text-gray-600 mb-4">في حالة وجود أي استفسارات عاجلة:</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/966543699901?text=مرحباً، لدي استفسار بخصوص طلبي" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                <i className="fab fa-whatsapp text-xl ml-2"></i>
                واتساب
              </a>
              <a 
                href="tel:+966543699901"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                <i className="fas fa-phone text-lg ml-2"></i>
                اتصال مباشر
              </a>
            </div>
          </div>
          
          {/* Return to Home */}
          <Link 
            href="/"
            className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            <i className="fas fa-home text-lg ml-2"></i>
            العودة للرئيسية
          </Link>
        </div>
        
        {/* Additional Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-shield-alt text-xl"></i>
            </div>
            <h4 className="font-semibold mb-1">ضمان 5 سنوات</h4>
            <p className="text-sm opacity-90">على جميع المحركات</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-shipping-fast text-xl"></i>
            </div>
            <h4 className="font-semibold mb-1">توصيل سريع</h4>
            <p className="text-sm opacity-90">لجميع أنحاء المملكة</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-tools text-xl"></i>
            </div>
            <h4 className="font-semibold mb-1">صيانة متخصصة</h4>
            <p className="text-sm opacity-90">خدمة ما بعد البيع</p>
          </div>
        </div>
      </div>
    </div>
  );
}
