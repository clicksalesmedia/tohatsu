'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Declare global gtag functions
declare global {
  interface Window {
    gtag_report_conversion: (url?: string) => boolean;
    gtag_report_whatsapp_conversion: (url: string) => boolean;
  }
}

export default function Page() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [usage, setUsage] = useState('ترفيهي');
  const [notes, setNotes] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // National Day Offers Data
  const nationalDayOffers = [
    {
      model: 'MFS 140',
      power: '140 حصان',
      originalPrice: 48155,
      salePrice: 38024,
      discount: 21,
      savings: 10131,
      badge: 'الأقوى',
      color: 'red',
      features: ['أقوى محرك في الفئة', 'مثالي للقوارب الكبيرة', 'تقنية EFI متطورة']
    },
    {
      model: 'MFS 115',
      power: '115 حصان',
      originalPrice: 43915,
      salePrice: 34623,
      discount: 21,
      savings: 9292,
      badge: 'الأكثر مبيعاً',
      color: 'green',
      features: ['الخيار الأمثل', 'توازن مثالي', 'اقتصادي في الوقود']
    },
    {
      model: 'MFS 100',
      power: '100 حصان',
      originalPrice: 43718,
      salePrice: 34475,
      discount: 21,
      savings: 9243,
      badge: 'قيمة ممتازة',
      color: 'blue',
      features: ['أداء متميز', 'هادئ جداً', 'سهل الصيانة']
    },
    {
      model: 'MFS 90',
      power: '90 حصان',
      originalPrice: 42675,
      salePrice: 33640,
      discount: 21,
      savings: 9035,
      badge: 'الأخف وزناً',
      color: 'orange',
      features: ['خفيف الوزن', 'مثالي للصيد', 'تشغيل سلس']
    },
    {
      model: 'MFS 75',
      power: '75 حصان',
      originalPrice: 42821,
      salePrice: 33757,
      discount: 21,
      savings: 9064,
      badge: 'الأكثر اقتصاداً',
      color: 'purple',
      features: ['استهلاك منخفض', 'مثالي للرحلات', 'موثوقية عالية']
    }
  ];

  // Helper function to get correct image extension for each model
  const getImagePath = (model: string) => {
    const modelNumber = model.split(' ')[1];
    const extensions: { [key: string]: string } = {
      '75': 'jpg',
      '90': 'png',
      '100': 'jpg',
      '115': 'png',
      '140': 'jpg'
    };
    return `/nd/mfs${modelNumber.toLowerCase()}.${extensions[modelNumber] || 'jpg'}`;
  };

  // Countdown timer for National Day offer
  useEffect(() => {
    const offerEndDate = new Date('2025-09-30T23:59:59');
    
    const timer = setInterval(() => {
      const now = new Date();
      const difference = offerEndDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Function to handle quote request
  const handleQuoteRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!fullName.trim()) {
      alert('يرجى إدخال الاسم الكامل');
      return;
    }
    if (!phoneNumber.trim()) {
      alert('يرجى إدخال رقم الجوال');
      return;
    }
    if (!selectedModel) {
      alert('يرجى اختيار موديل المحرك');
      return;
    }
    if (!selectedCity) {
      alert('يرجى اختيار المدينة');
      return;
    }
    if (!agreeToTerms) {
      alert('يرجى الموافقة على شروط الخدمة');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save to database first
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          mobile: phoneNumber,
          engineModel: selectedModel,
          city: selectedCity,
          usageType: usage,
          additionalNotes: notes || null,
          campaign: 'national-day-95-2025'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save lead');
      }

      // Generate WhatsApp message with price info
      const selectedOffer = nationalDayOffers.find(offer => selectedModel.includes(offer.model));
      const priceInfo = selectedOffer 
        ? `\n💰 السعر الخاص: ${selectedOffer.salePrice.toLocaleString()} ريال (بدلاً من ${selectedOffer.originalPrice.toLocaleString()} ريال)\n🎁 توفير: ${selectedOffer.savings.toLocaleString()} ريال`
        : '';

      const message = `مرحباً، أريد الاستفادة من عروض اليوم الوطني 95 على محركات توهاتسو:

الاسم: ${fullName}
الجوال: ${phoneNumber}
الموديل: ${selectedModel}${priceInfo}
المدينة: ${selectedCity}
الاستخدام: ${usage}
${notes ? `ملاحظات: ${notes}` : ''}

🇸🇦 عرض اليوم الوطني الخاص - خصم 21%

أرجو تأكيد الحجز وإرسال تفاصيل العرض.

شكراً لكم.`;
      
      const whatsappUrl = `https://wa.me/966543699901?text=${encodeURIComponent(message)}`;
      
      // Track Lead conversion event with Meta Pixel
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: selectedModel,
          content_category: 'Engine',
          value: selectedOffer?.salePrice || 0,
          currency: 'SAR',
          predicted_ltv: selectedOffer?.salePrice || 50000,
          custom_data: {
            engine_model: selectedModel,
            city: selectedCity,
            usage_type: usage,
            customer_name: fullName,
            phone: phoneNumber,
            campaign: 'national-day-95-2025',
            discount_amount: selectedOffer?.savings || 0
          }
        });
        
        // Also track Contact event for broader tracking
        window.fbq('track', 'Contact');
      }
      
      // Track Lead Form conversion with Google Ads (fires on form submit)
      if (typeof window !== 'undefined' && window.gtag_report_conversion) {
        window.gtag_report_conversion();
      }
      
      // Open WhatsApp in new tab (separate from conversion tracking)
      window.open(whatsappUrl, '_blank');

      // Redirect to thank you page with customer details
      const thankYouUrl = `/thank-you?name=${encodeURIComponent(fullName)}&model=${encodeURIComponent(selectedModel)}&campaign=national-day-95`;
      router.push(thankYouUrl);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  // Effect for scroll animations and navigation
  useEffect(() => {
    // Scroll Reveal Animation
    const reveals = document.querySelectorAll<HTMLElement>('.reveal');
    const revealElements = () => {
      const windowHeight = window.innerHeight;
      reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) {
          document.querySelector(href)?.scrollIntoView({
            behavior: 'smooth'
          });
          // Close mobile menu when a link is clicked
          setMobileMenuOpen(false);
        }
      });
    });

    // Floating navigation effect
    const nav = document.querySelector<HTMLElement>('.float-nav');
    const handleScroll = () => {
      if (nav) {
        if (window.scrollY > 100) {
          nav.classList.add('shadow-lg', 'py-2');
          nav.classList.remove('py-4');
        } else {
          nav.classList.remove('shadow-lg', 'py-2');
          nav.classList.add('py-4');
        }
      }
    };

    window.addEventListener('scroll', revealElements);
    window.addEventListener('scroll', handleScroll);
    revealElements();

    return () => {
      window.removeEventListener('scroll', revealElements);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setMobileMenuOpen]);

  return (
    <main>
      {/* National Day Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2 text-center fixed top-0 left-0 right-0 z-[60]">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <span className="text-yellow-400 mr-2 animate-pulse">⚡</span>
          <span className="text-sm md:text-base font-bold">
            عروض اليوم الوطني السعودي 95 - خصومات تصل إلى 21% على جميع المحركات
          </span>
          <span className="text-yellow-400 ml-2 animate-pulse">⚡</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 z-50 py-4 float-nav bg-white bg-opacity-95 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://www.tohatsu.com/all/logo_allTop.png"
              alt="توهاتسو"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
            <span className="ml-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              خصم 21%
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#home" className="nav-link text-gray-800 hover:text-green-600 text-lg font-medium ml-8">الرئيسية</a>
            <a href="#national-day-offers" className="nav-link text-green-600 hover:text-green-700 text-lg font-bold ml-8 relative">
              العروض الخاصة
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">21% خصم</span>
            </a>
            <a href="#products" className="nav-link text-gray-800 hover:text-green-600 text-lg font-medium ml-8">المنتجات</a>
            <a href="#features" className="nav-link text-gray-800 hover:text-green-600 text-lg font-medium ml-8">المميزات</a>
            <a href="#contact" className="nav-link text-gray-800 hover:text-green-600 text-lg font-medium">اتصل بنا</a>
          </div>
          <div className="md:hidden">
            <button 
              className="text-gray-800 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="قائمة الجوال"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transform transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div 
          className={`fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full p-6 pt-20">
            <a href="#home" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-green-600 text-lg font-medium">الرئيسية</a>
            <a href="#national-day-offers" className="py-3 px-4 border-b border-gray-100 text-green-600 hover:text-green-700 text-lg font-bold">عروض اليوم الوطني</a>
            <a href="#products" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-green-600 text-lg font-medium">المنتجات</a>
            <a href="#features" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-green-600 text-lg font-medium">المميزات</a>
            <a href="#contact" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-green-600 text-lg font-medium">اتصل بنا</a>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/966543699901?text=مرحباً، أريد الاستفادة من عروض اليوم الوطني 95 على محركات توهاتسو - خصم 21% 🇸🇦" 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={() => {
          if (typeof window !== 'undefined' && window.gtag_report_whatsapp_conversion) {
            window.gtag_report_whatsapp_conversion('https://wa.me/966543699901?text=مرحباً، أريد الاستفادة من عروض اليوم الوطني على محركات توهاتسو');
          }
          // Track Contact event with Meta Pixel
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Contact', {
              content_name: 'WhatsApp Button Click - National Day 95',
              content_category: 'Contact',
            });
          }
        }}
        className="fixed bottom-6 left-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 animate-pulse"
        aria-label="تواصل معنا عبر واتساب"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </a>

      {/* Hero Section - National Day Themed */}
      <section id="home" className="relative h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-600 flex items-center overflow-hidden mt-8">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
          <Image
            src="/hero.webp"
            alt="توهاتسو - خلفية"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Saudi Flag Pattern Overlay */}
        <div className="absolute inset-0 z-5 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <div className="mb-6">
                <span className="bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
                  🇸🇦 احتفالاً باليوم الوطني السعودي 95
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow leading-tight">
                خصم <span className="text-yellow-400">21%</span> على جميع محركات توهاتسو
              </h1>
              <p className="text-xl mb-4">وفر حتى 10,131 ريال سعودي + تركيب مجاني + ضمان ممتد</p>
              <p className="text-lg mb-8 text-yellow-200">العرض ساري حتى 30 سبتمبر 2025</p>
              
              {/* Optimized Countdown Timer */}
              <div className="relative bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20 shadow-2xl">
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-green-400/20 rounded-2xl blur-xl opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse flex items-center">
                      <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
                      🔥 ينتهي العرض خلال
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-xl p-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="text-4xl font-black text-green-900 mb-1 tabular-nums">{timeLeft.days.toString().padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-green-800 uppercase tracking-wide">يوم</div>
                    </div>
                    
                    <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-xl p-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="text-4xl font-black text-green-900 mb-1 tabular-nums">{timeLeft.hours.toString().padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-green-800 uppercase tracking-wide">ساعة</div>
                    </div>
                    
                    <div className="bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-xl p-3 transform hover:scale-105 transition-all duration-300 shadow-lg">
                      <div className="text-4xl font-black text-green-900 mb-1 tabular-nums">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-green-800 uppercase tracking-wide">دقيقة</div>
                    </div>
                    
                    <div className="bg-gradient-to-b from-red-400 to-red-500 rounded-xl p-3 transform hover:scale-105 transition-all duration-300 shadow-lg animate-pulse">
                      <div className="text-4xl font-black text-white mb-1 tabular-nums">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-xs font-bold text-white uppercase tracking-wide">ثانية</div>
                    </div>
                  </div>
                  
                  {/* Urgency message */}
                  <div className="mt-4 text-center">
                    <p className="text-yellow-300 text-sm font-medium animate-bounce">
                      ⚡ احجز الآن قبل انتهاء الوقت!
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                <a href="#national-day-offers" className="bg-yellow-400 text-green-900 px-8 py-4 lg:ml-4 rounded-lg text-lg font-bold hover:bg-yellow-300 transition duration-300 transform hover:scale-105 shadow-lg text-center animate-pulse">
                  شاهد العروض الخاصة
                </a>
                <a href="#quote" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-green-900 transition duration-300 text-center">
                  احصل على عرض سعر
                </a>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="absolute -top-4 -right-4 bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg animate-bounce">
                خصم 21%
              </div>
              <Image
                src="/engineimage.png"
                alt="محرك توهاتسو"
                width={500}
                height={500}
                className="animate-float max-h-[500px] mx-auto"
                priority
              />
              <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-green-900 px-6 py-3 rounded-full font-bold text-lg shadow-lg">
                وفر حتى 10,131 ريال
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 text-white text-center pb-8 z-10">
          <a 
            href="#national-day-offers" 
            className="inline-block hover:text-yellow-400 transition-colors duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#national-day-offers')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            <p className="mb-2">اكتشف العروض</p>
            <i className="fas fa-chevron-down scroll-down-arrow"></i>
          </a>
        </div>
      </section>

      {/* National Day Special Offers Section with Exact Prices */}
      <section id="national-day-offers" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <div className="inline-flex items-center justify-center mb-6">
              <span className="text-4xl mr-3">🇸🇦</span>
              <h2 className="text-4xl font-bold text-gray-800">عروض <span className="text-green-600">اليوم الوطني 95</span> الحصرية</h2>
              <span className="text-4xl ml-3">🇸🇦</span>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">خصم موحد 21% على جميع المحركات - أسعار لا تُفوّت!</p>
            <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse">
              🔥 وفر حتى 10,131 ريال سعودي 🔥
            </div>
          </div>

          {/* Price Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {nationalDayOffers.slice(0, 3).map((offer, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover reveal fade-bottom transform hover:scale-105 transition-all duration-300">
                {/* Engine Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getImagePath(offer.model)}
                    alt={`محرك ${offer.model} - عرض اليوم الوطني`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    {offer.badge}
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Engine Name as Title */}
                  <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">محرك توهاتسو {offer.model}</h2>
                    <p className="text-lg text-gray-600 font-semibold">{offer.power}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="text-gray-500 text-lg line-through mb-2">{offer.originalPrice.toLocaleString()} ريال</p>
                    <p className="text-5xl font-bold text-green-600 mb-2">{offer.salePrice.toLocaleString()}</p>
                    <p className="text-lg text-gray-600">ريال سعودي</p>
                    <div className="mt-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2">
                      <p className="text-green-700 font-bold">وفر {offer.savings.toLocaleString()} ريال</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-center text-gray-700 font-bold">
                      <i className="fas fa-gift text-red-500 mr-2"></i>
                      <span>تركيب مجاني + ضمان ممتد</span>
                    </li>
                  </ul>
                  
                  <a href="#quote" className="block text-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
                    احجز الآن بهذا السعر
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Second Row - Remaining Offers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {nationalDayOffers.slice(3).map((offer, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover reveal fade-bottom transform hover:scale-105 transition-all duration-300">
                {/* Engine Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={getImagePath(offer.model)}
                    alt={`محرك ${offer.model} - عرض اليوم الوطني`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                    {offer.badge}
                  </div>
                </div>
                
                <div className="p-6">
                  {/* Engine Name as Title */}
                  <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">محرك توهاتسو {offer.model}</h2>
                    <p className="text-lg text-gray-600 font-semibold">{offer.power}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <p className="text-gray-500 text-lg line-through mb-2">{offer.originalPrice.toLocaleString()} ريال</p>
                    <p className="text-5xl font-bold text-green-600 mb-2">{offer.salePrice.toLocaleString()}</p>
                    <p className="text-lg text-gray-600">ريال سعودي</p>
                    <div className="mt-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-2">
                      <p className="text-green-700 font-bold">وفر {offer.savings.toLocaleString()} ريال</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {offer.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                    <li className="flex items-center text-gray-700 font-bold">
                      <i className="fas fa-gift text-red-500 mr-2"></i>
                      <span>تركيب مجاني + ضمان ممتد</span>
                    </li>
                  </ul>
                  
                  <a href="#quote" className="block text-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105">
                    احجز الآن بهذا السعر
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA Button */}
          <div className="text-center mb-16 reveal fade-bottom">
            <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">🇸🇦</span>
                  <h3 className="text-3xl font-bold text-white">لا تفوت عروض اليوم الوطني!</h3>
                  <span className="text-4xl ml-3">🇸🇦</span>
                </div>
                <p className="text-xl text-yellow-300 mb-6">وفر حتى 10,131 ريال + تركيب مجاني + ضمان ممتد</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="#quote" className="bg-yellow-400 hover:bg-yellow-300 text-green-900 px-10 py-4 rounded-xl text-xl font-black transition duration-300 transform hover:scale-110 shadow-lg flex items-center">
                    <span className="mr-3">🔥</span>
                    احجز محركك الآن
                    <span className="ml-3">⚡</span>
                  </a>
                  <a href="https://wa.me/966543699901?text=مرحباً، أريد الاستفسار عن عروض اليوم الوطني لمحركات توهاتسو" target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-green-400 text-white px-10 py-4 rounded-xl text-xl font-bold transition duration-300 transform hover:scale-110 shadow-lg flex items-center">
                    <i className="fab fa-whatsapp text-2xl mr-3"></i>
                    تواصل عبر واتساب
                  </a>
                </div>
                <p className="text-yellow-200 text-sm mt-4 animate-pulse">
                  ⏰ العرض محدود حتى 30 سبتمبر 2025
                </p>
              </div>
            </div>
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12 reveal fade-bottom">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
              <h3 className="text-2xl font-bold text-center">جدول الأسعار الكامل - عروض اليوم الوطني 95</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-right font-bold text-gray-800">الموديل</th>
                    <th className="px-6 py-4 text-center font-bold text-gray-800">القوة</th>
                    <th className="px-6 py-4 text-center font-bold text-gray-800">السعر الأصلي</th>
                    <th className="px-6 py-4 text-center font-bold text-gray-800">الخصم</th>
                    <th className="px-6 py-4 text-center font-bold text-gray-800">السعر بعد الخصم</th>
                    <th className="px-6 py-4 text-center font-bold text-gray-800">التوفير</th>
                  </tr>
                </thead>
                <tbody>
                  {nationalDayOffers.map((offer, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800">{offer.model}</td>
                      <td className="px-6 py-4 text-center">{offer.power}</td>
                      <td className="px-6 py-4 text-center text-gray-500 line-through">{offer.originalPrice.toLocaleString()} ريال</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">{offer.discount}%</span>
                      </td>
                      <td className="px-6 py-4 text-center text-green-600 font-bold text-lg">{offer.salePrice.toLocaleString()} ريال</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">{offer.savings.toLocaleString()} ريال</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>



        </div>
      </section>

      {/* Products Section - Updated with National Day badges */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">تشكيلة <span className="text-green-600">محركاتنا</span> البحرية</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">جميع المحركات متوفرة بخصم 21% احتفالاً باليوم الوطني</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mid-Range Motors */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover reveal fade-bottom">
              <div className="relative">
                <Image
                  src="/img_mfs140a.png"
                  alt="محركات متوسطة المدى"
                  width={400}
                  height={256}
                  className="w-full h-64 object-contain bg-gray-100"
                />
                <div className="absolute top-0 left-0 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-br-lg font-semibold">
                  خصم 21%
                </div>
                <div className="absolute top-0 right-0 bg-red-600 text-white py-2 px-4 rounded-bl-lg font-semibold animate-pulse">
                  عرض اليوم الوطني
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">محركات متوسطة المدى</h3>
                <div className="flex items-center mb-3">
                  <span className="text-green-600 text-lg font-bold">75-140 حصان</span>
                  <div className="h-1 w-1 bg-gray-300 rounded-full mx-2"></div>
                  <span className="text-gray-600">للقوارب المتوسطة</span>
                </div>
                
                {/* Horsepower Table with Prices */}
                <div className="mb-4 bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">الموديلات المتاحة والأسعار</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">MFS 140:</span>
                      <span className="text-green-600 font-bold">38,024 ريال</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">MFS 115:</span>
                      <span className="text-green-600 font-bold">34,623 ريال</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">MFS 100:</span>
                      <span className="text-green-600 font-bold">34,475 ريال</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">MFS 90:</span>
                      <span className="text-green-600 font-bold">33,640 ريال</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold">MFS 75:</span>
                      <span className="text-green-600 font-bold">33,757 ريال</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
                  <p className="text-sm font-bold text-yellow-800">🎁 الهدايا: تركيب مجاني + ضمان ممتد + حقيبة أدوات</p>
                </div>
                <div className="mt-auto">
                  <a href="#quote" className="block text-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                    احصل على عرض السعر الخاص
                  </a>
                </div>
              </div>
            </div>
            
            {/* Portable Motors */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden card-hover reveal fade-left">
              <div className="relative">
                <Image
                  src="/img_mfs20.png"
                  alt="محركات محمولة"
                  width={400}
                  height={256}
                  className="w-full h-64 object-contain bg-gray-100"
                />
                <div className="absolute top-0 left-0 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-br-lg font-semibold">
                  خصم يصل إلى 21%
                </div>
                <div className="absolute top-0 right-0 bg-orange-500 text-white py-2 px-4 rounded-bl-lg font-semibold">
                  خفيفة الوزن
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">محركات محمولة</h3>
                <div className="flex items-center mb-3">
                  <span className="text-green-600 text-lg font-bold">2.5-30 حصان</span>
                  <div className="h-1 w-1 bg-gray-300 rounded-full mx-2"></div>
                  <span className="text-gray-600">للقوارب الصغيرة</span>
                </div>
                
                {/* Horsepower Table */}
                <div className="mb-4 bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">القوة المتاحة (حصان)</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[30, 20, 10, 5, 2.5].map((hp) => (
                      <span key={hp} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {hp}
                      </span>
                    ))}
                  </div>
                  <p className="text-center text-sm text-green-600 font-bold mt-3">أسعار خاصة - اتصل للاستفسار</p>
                </div>
                
                <p className="text-gray-600 mb-4">محركات خفيفة الوزن وسهلة الحمل مع عروض خاصة باليوم الوطني.</p>
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-4">
                  <p className="text-sm font-bold text-yellow-800">🎁 الهدايا: حقيبة حمل + صيانة مجانية لمدة سنة</p>
                </div>
                <div className="mt-auto">
                  <a href="#quote" className="block text-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                    احصل على عرض السعر الخاص
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Keep the same with green accent */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">تقنية <span className="text-green-600">متطورة</span> في كل محرك</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">صممت محركات توهاتسو لتقديم تجربة قيادة مثالية مع موثوقية عالية وأداء متميز</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Japanese Reliability */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-green-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">موثوقية يابانية</h3>
              <p className="text-gray-600">مصنعة وفق أعلى معايير الجودة اليابانية، مع ضمان يمتد لخمس سنوات للاستخدام الترفيهي.</p>
            </div>
            
            {/* Feature 2 - Exceptional Performance */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-tachometer-alt text-green-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">أداء استثنائي</h3>
              <p className="text-gray-600">نسبة قوة إلى وزن هي الأفضل في فئتها، مما يوفر تسارعًا مثاليًا وسرعات قصوى عالية.</p>
            </div>
            
            {/* Feature 3 - Lightweight */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-feather-alt text-orange-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">خفيفة الوزن</h3>
              <p className="text-gray-600">تصميم خفيف الوزن وقوي في نفس الوقت، يجعل من محركات توهاتسو الخيار الأمثل.</p>
            </div>
            
            {/* Feature 4 - Fuel Efficiency */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-gas-pump text-red-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">كفاءة في استهلاك الوقود</h3>
              <p className="text-gray-600">تقنية حقن الوقود الإلكتروني (EFI) توفر استهلاكًا أمثل للوقود.</p>
            </div>
            
            {/* Feature 5 - Easy Maintenance */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-tools text-yellow-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">سهولة الصيانة</h3>
              <p className="text-gray-600">تصميم يراعي سهولة الوصول إلى مكونات المحرك لإجراء الصيانة الدورية.</p>
            </div>
            
            {/* Feature 6 - Quiet Operation */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-volume-mute text-purple-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تشغيل هادئ</h3>
              <p className="text-gray-600">نظام عادم عبر المروحة يوفر تجربة إبحار هادئة مع تقليل الاهتزازات.</p>
            </div>
          </div>
          
          <div className="text-center mt-12 reveal fade-bottom">
            <a href="#quote" className="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg">
              <i className="fas fa-gift text-xl ml-2"></i>
              احصل على عرض اليوم الوطني الخاص
            </a>
          </div>
        </div>
      </section>

      {/* Technology Showcase - Keep the same */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">تقنيات <span className="text-green-600">متطورة</span> في كل تفصيل</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">محركات توهاتسو مصممة لتقديم تجربة إبحار لا مثيل لها</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 reveal fade-right">
              <div className="mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">نظام حقن الوقود الإلكتروني (EFI)</h3>
                <p className="text-gray-600 text-lg mb-6">تتميز محركات توهاتسو بنظام حقن الوقود الإلكتروني المتطور الذي يوفر:</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 ml-2"></i>
                    <span>بدء تشغيل فوري حتى في الظروف الباردة</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 ml-2"></i>
                    <span>استجابة سريعة للخانق في جميع سرعات الدوران</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 ml-2"></i>
                    <span>كفاءة أعلى في استهلاك الوقود بنسبة تصل إلى 30%</span>
                  </li>
                  <li className="flex items-start">
                    <i className="fas fa-check-circle text-green-500 mt-1 ml-2"></i>
                    <span>انبعاثات أقل وصديقة للبيئة</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 reveal fade-left">
              <Image
                src="/mfs30d_na_R1.jpg"
                alt="تقنية متطورة"
                width={500}
                height={375}
                className="rounded-xl shadow-2xl transform -rotate-6 hover:rotate-0 transition duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with Statistics - National Day Themed */}
      <section className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white relative">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/hero.webp"
            alt="توهاتسو - خلفية"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center reveal fade-bottom">
            <h2 className="text-4xl font-bold mb-6">اختر الأفضل <span className="text-yellow-400">لقاربك</span></h2>
            <p className="text-xl mb-8 max-w-4xl mx-auto">احتفل معنا باليوم الوطني 95 واحصل على أفضل العروض على محركات توهاتسو اليابانية الأصلية</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-green-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-green-600">
                <div className="text-4xl font-bold text-yellow-400 mb-2">95</div>
                <p>عام من الفخر الوطني</p>
              </div>
              <div className="text-center p-6 bg-green-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-green-600">
                <div className="text-4xl font-bold text-yellow-400 mb-2">21%</div>
                <p>خصم اليوم الوطني</p>
              </div>
              <div className="text-center p-6 bg-green-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-green-600">
                <div className="text-4xl font-bold text-yellow-400 mb-2">5</div>
                <p>سنوات ضمان</p>
              </div>
              <div className="text-center p-6 bg-green-800 bg-opacity-50 backdrop-blur-sm rounded-lg border border-green-600">
                <div className="text-4xl font-bold text-yellow-400 mb-2">10K+</div>
                <p>ريال توفير</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Section - National Day Themed */}
      <section id="quote" className="py-20 bg-gradient-to-b from-gray-50 to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 reveal fade-bottom">
              <div className="inline-flex items-center justify-center mb-4">
                <span className="text-3xl mr-2">🇸🇦</span>
                <h2 className="text-4xl font-bold text-gray-800">احصل على <span className="text-green-600">عرض اليوم الوطني 95</span></h2>
                <span className="text-3xl ml-2">🇸🇦</span>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">استفد من خصم 21% الحصري واحصل على أفضل الأسعار والهدايا القيمة</p>
              <div className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse">
                🔥 العرض محدود - احجز الآن 🔥
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-xl shadow-lg reveal fade-right border-2 border-green-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">طلب عرض سعر خاص</h3>
                      <p className="text-gray-600">احصل على عرض اليوم الوطني الحصري</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      خصم 21%
                    </div>
                  </div>
                  
                  <form onSubmit={handleQuoteRequest}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="fullName">الاسم الكامل *</label>
                        <input 
                          type="text" 
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 form-input" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="phoneNumber">رقم الجوال *</label>
                        <input 
                          type="tel" 
                          id="phoneNumber"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="05xxxxxxxx"
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 form-input" 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="model">موديل المحرك المطلوب *</label>
                        <select 
                          id="model" 
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 form-input"
                          required
                        >
                          <option value="">-- اختر الموديل --</option>
                          <option value="MFS 140 حصان">MFS 140 (38,024 ريال)</option>
                          <option value="MFS 115 حصان">MFS 115 (34,623 ريال)</option>
                          <option value="MFS 100 حصان">MFS 100 (34,475 ريال)</option>
                          <option value="MFS 90 حصان">MFS 90 (33,640 ريال)</option>
                          <option value="MFS 75 حصان">MFS 75 (33,757 ريال)</option>
                          <option value="MFS 60 حصان">MFS 60 حصان</option>
                          <option value="MFS 30 حصان">MFS 30 حصان</option>
                          <option value="MFS 20 حصان">MFS 20 حصان</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="city">المدينة *</label>
                        <select 
                          id="city" 
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 form-input"
                          required
                        >
                          <option value="">-- اختر المدينة --</option>
                          <option value="الرياض">الرياض</option>
                          <option value="جدة">جدة</option>
                          <option value="الدمام">الدمام</option>
                          <option value="مكة المكرمة">مكة المكرمة</option>
                          <option value="المدينة المنورة">المدينة المنورة</option>
                          <option value="الخبر">الخبر</option>
                          <option value="الطائف">الطائف</option>
                          <option value="بريدة">بريدة</option>
                          <option value="تبوك">تبوك</option>
                          <option value="خميس مشيط">خميس مشيط</option>
                          <option value="أبها">أبها</option>
                          <option value="حائل">حائل</option>
                          <option value="الجبيل">الجبيل</option>
                          <option value="ينبع">ينبع</option>
                          <option value="أخرى">أخرى</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-3 font-semibold">الاستخدام المتوقع</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className={`relative cursor-pointer ${usage === 'ترفيهي' ? 'ring-2 ring-green-500' : ''}`}>
                          <input 
                            type="radio" 
                            name="usage" 
                            value="ترفيهي"
                            checked={usage === 'ترفيهي'}
                            onChange={(e) => setUsage(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                            usage === 'ترفيهي' 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                          }`}>
                            <div className="flex flex-col items-center">
                              <i className={`fas fa-ship text-2xl mb-2 ${
                                usage === 'ترفيهي' ? 'text-green-600' : 'text-gray-400'
                              }`}></i>
                              <span className="font-medium">ترفيهي</span>
                              <span className="text-xs text-gray-500 mt-1">رحلات عائلية</span>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`relative cursor-pointer ${usage === 'صيد' ? 'ring-2 ring-green-500' : ''}`}>
                          <input 
                            type="radio" 
                            name="usage" 
                            value="صيد"
                            checked={usage === 'صيد'}
                            onChange={(e) => setUsage(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                            usage === 'صيد' 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                          }`}>
                            <div className="flex flex-col items-center">
                              <i className={`fas fa-fish text-2xl mb-2 ${
                                usage === 'صيد' ? 'text-green-600' : 'text-gray-400'
                              }`}></i>
                              <span className="font-medium">صيد</span>
                              <span className="text-xs text-gray-500 mt-1">رحلات الصيد</span>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`relative cursor-pointer ${usage === 'تجاري' ? 'ring-2 ring-green-500' : ''}`}>
                          <input 
                            type="radio" 
                            name="usage" 
                            value="تجاري"
                            checked={usage === 'تجاري'}
                            onChange={(e) => setUsage(e.target.value)}
                            className="sr-only"
                          />
                          <div className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                            usage === 'تجاري' 
                              ? 'border-green-500 bg-green-50 text-green-700' 
                              : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                          }`}>
                            <div className="flex flex-col items-center">
                              <i className={`fas fa-anchor text-2xl mb-2 ${
                                usage === 'تجاري' ? 'text-green-600' : 'text-gray-400'
                              }`}></i>
                              <span className="font-medium">تجاري</span>
                              <span className="text-xs text-gray-500 mt-1">استخدام تجاري</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="block text-gray-700 mb-2 font-semibold" htmlFor="notes">ملاحظات إضافية (اختياري)</label>
                      <textarea 
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="أي متطلبات خاصة أو أسئلة إضافية..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 form-input"
                      ></textarea>
                    </div>
                    
                    <div className="mb-6 flex items-start">
                      <input 
                        type="checkbox" 
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="ml-2 h-5 w-5 text-green-600 mt-1" 
                        required 
                      />
                      <label htmlFor="agreeToTerms" className="text-gray-700">أوافق على شروط الخدمة وتلقي عروض اليوم الوطني الخاصة *</label>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white font-bold py-4 px-4 rounded-lg transition duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin text-xl ml-2"></i>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-gift text-xl ml-2"></i>
                          احصل على عرض اليوم الوطني الآن
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-gray-500 text-sm mt-4">
                      سنتواصل معك خلال 24 ساعة بعرض اليوم الوطني الخاص
                    </p>
                  </form>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="lg:col-span-1">
                <div className="space-y-6 reveal fade-left">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl shadow-lg text-center text-white">
                    <div className="w-16 h-16 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">🇸🇦</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">عرض اليوم الوطني 95</h4>
                    <p className="text-green-100">خصم موحد 21% على جميع المحركات</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center border-2 border-yellow-400">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-gift text-yellow-600 text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">هدايا قيمة</h4>
                    <p className="text-gray-600">تركيب مجاني + ضمان ممتد + أدوات</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-piggy-bank text-green-600 text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">وفر حتى</h4>
                    <p className="text-green-600 text-2xl font-bold">10,131 ريال</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-fire text-red-600 text-2xl animate-pulse"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">عرض محدود</h4>
                    <p className="text-gray-600">حتى 30 سبتمبر فقط</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section - National Day Themed */}
      <footer className="bg-gradient-to-br from-green-900 to-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <Image
                src="https://www.tohatsu.com/all/logo_allTop.png"
                alt="توهاتسو"
                width={120}
                height={48}
                className="h-12 w-auto mb-6 brightness-0 invert"
              />
              <p className="text-green-100 mb-6">توهاتسو، شريكك الموثوق في المياه السعودية. نحتفل معكم باليوم الوطني 95 بعروض حصرية.</p>
              <div className="flex space-x-4 space-x-reverse">
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-green-900 transition duration-300">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-green-900 transition duration-300">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-green-900 transition duration-300">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-green-900 transition duration-300">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-yellow-400">روابط سريعة</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-green-100 hover:text-yellow-400 transition duration-300">الرئيسية</a></li>
                <li><a href="#national-day-offers" className="text-green-100 hover:text-yellow-400 transition duration-300">عروض اليوم الوطني</a></li>
                <li><a href="#products" className="text-green-100 hover:text-yellow-400 transition duration-300">المنتجات</a></li>
                <li><a href="#features" className="text-green-100 hover:text-yellow-400 transition duration-300">المميزات</a></li>
                <li><a href="#contact" className="text-green-100 hover:text-yellow-400 transition duration-300">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-yellow-400">المنتجات</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">محركات متوسطة المدى</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">محركات محمولة</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">قطع الغيار</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">الإكسسوارات</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-yellow-400">الدعم</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">مراكز الخدمة</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">الضمان</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">الأسئلة الشائعة</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">تحميل الكتالوجات</a></li>
                <li><a href="#" className="text-green-100 hover:text-yellow-400 transition duration-300">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-green-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-green-100 text-center md:text-right mb-4 md:mb-0">© 2025 توهاتسو السعودية. جميع الحقوق محفوظة.</p>
            <div className="flex items-center">
              <span className="text-yellow-400 mr-2">🇸🇦</span>
              <span className="text-green-100">نفخر بخدمة المملكة العربية السعودية</span>
              <span className="text-yellow-400 ml-2">🇸🇦</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
