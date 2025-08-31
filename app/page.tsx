'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save lead');
      }

      // Generate WhatsApp message
      const message = `مرحباً، أطلب عرض سعر لمحرك توهاتسو:

الاسم: ${fullName}
الجوال: ${phoneNumber}
الموديل: ${selectedModel}
المدينة: ${selectedCity}
الاستخدام: ${usage}
${notes ? `ملاحظات: ${notes}` : ''}

أرجو إرسال أفضل عرض سعر.

شكراً لكم.`;
      
      const whatsappUrl = `https://wa.me/966543699901?text=${encodeURIComponent(message)}`;
      
      // Track Lead conversion event with Meta Pixel
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: selectedModel,
          content_category: 'Engine',
          value: 0,
          currency: 'SAR',
          predicted_ltv: 50000,
          custom_data: {
            engine_model: selectedModel,
            city: selectedCity,
            usage_type: usage,
            customer_name: fullName,
            phone: phoneNumber
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
      const thankYouUrl = `/thank-you?name=${encodeURIComponent(fullName)}&model=${encodeURIComponent(selectedModel)}`;
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
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 float-nav bg-white bg-opacity-95 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src="https://www.tohatsu.com/all/logo_allTop.png"
              alt="توهاتسو"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#home" className="nav-link text-gray-800 hover:text-blue-600 text-lg font-medium ml-8">الرئيسية</a>
            <a href="#products" className="nav-link text-gray-800 hover:text-blue-600 text-lg font-medium ml-8">المنتجات</a>
            <a href="#features" className="nav-link text-gray-800 hover:text-blue-600 text-lg font-medium ml-8">المميزات</a>
            <a href="#testimonials" className="nav-link text-gray-800 hover:text-blue-600 text-lg font-medium ml-8">آراء العملاء</a>
            <a href="#contact" className="nav-link text-gray-800 hover:text-blue-600 text-lg font-medium">اتصل بنا</a>
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
            <a href="#home" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-blue-600 text-lg font-medium">الرئيسية</a>
            <a href="#products" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-blue-600 text-lg font-medium">المنتجات</a>
            <a href="#features" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-blue-600 text-lg font-medium">المميزات</a>
            <a href="#testimonials" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-blue-600 text-lg font-medium">آراء العملاء</a>
            <a href="#contact" className="py-3 px-4 border-b border-gray-100 text-gray-800 hover:text-blue-600 text-lg font-medium">اتصل بنا</a>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/966543699901?text=مرحباً، أريد الاستفسار عن محركات توهاتسو" 
        target="_blank" 
        rel="noopener noreferrer" 
        onClick={() => {
          if (typeof window !== 'undefined' && window.gtag_report_whatsapp_conversion) {
            window.gtag_report_whatsapp_conversion('https://wa.me/966543699901?text=مرحباً، أريد الاستفسار عن محركات توهاتسو');
          }
          // Track Contact event with Meta Pixel
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Contact', {
              content_name: 'WhatsApp Button Click',
              content_category: 'Contact',
            });
          }
        }}
        className="fixed bottom-6 left-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110"
        aria-label="تواصل معنا عبر واتساب"
      >
        <i className="fab fa-whatsapp text-2xl"></i>
      </a>

      {/* Hero Section */}
      <section id="home" className="relative h-screen bg-gradient-blue flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
          <Image
            src="/hero.webp"
            alt="توهاتسو - خلفية"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow leading-tight">اكتشف قوة <span className="text-yellow-400">توهاتسو</span> في المياه السعودية</h1>
              <p className="text-xl mb-8">محركات خارجية متطورة بتقنية يابانية عالية الجودة، صُممت خصيصاً للمياه المحلية والظروف البحرية في المملكة العربية السعودية.</p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                <a href="#products" className="bg-white text-blue-900 px-8 py-4 lg:ml-4 rounded-lg text-lg font-bold hover:bg-yellow-400 transition duration-300 transform hover:scale-105 shadow-lg text-center">استكشف الموديلات</a>
                <a href="#quote" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-900 transition duration-300 text-center">تواصل معنا</a>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/mfs30d_na_R1.jpg"
                alt="محرك توهاتسو"
                width={400}
                height={400}
                className="animate-float max-h-96 mx-auto"
                priority
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 text-white text-center pb-8 z-10">
          <a 
            href="#products" 
            className="inline-block hover:text-yellow-400 transition-colors duration-300 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#products')?.scrollIntoView({
                behavior: 'smooth'
              });
            }}
          >
            <p className="mb-2">اكتشف المزيد</p>
            <i className="fas fa-chevron-down scroll-down-arrow"></i>
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">تشكيلة <span className="text-blue-600">محركاتنا</span> البحرية</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">تقدم توهاتسو مجموعة متنوعة من المحركات الخارجية لتناسب جميع احتياجاتك البحرية بجودة يابانية لا مثيل لها</p>
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
                <div className="absolute top-0 left-0 bg-green-600 text-white py-2 px-4 rounded-br-lg font-semibold">
                  الأكثر مبيعاً
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">محركات متوسطة المدى</h3>
                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 text-lg font-bold">75-140 حصان</span>
                  <div className="h-1 w-1 bg-gray-300 rounded-full mx-2"></div>
                  <span className="text-gray-600">للقوارب المتوسطة</span>
                </div>
                
                {/* Horsepower Table */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">القوة المتاحة (حصان)</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[140, 115, 100, 90, 75].map((hp) => (
                      <span key={hp} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {hp}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">مجموعة متنوعة من المحركات رباعية الأشواط التي تجمع بين الأداء المتميز والاقتصاد في استهلاك الوقود، مثالية للاستخدامات المتنوعة.</p>
                <div className="mt-auto">
                  <a href="#quote" className="block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">استفسر الآن</a>
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
                <div className="absolute top-0 left-0 bg-orange-500 text-white py-2 px-4 rounded-br-lg font-semibold">
                  خفيفة الوزن
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">محركات محمولة</h3>
                <div className="flex items-center mb-3">
                  <span className="text-yellow-500 text-lg font-bold">2.5-30 حصان</span>
                  <div className="h-1 w-1 bg-gray-300 rounded-full mx-2"></div>
                  <span className="text-gray-600">للقوارب الصغيرة</span>
                </div>
                
                {/* Horsepower Table */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">القوة المتاحة (حصان)</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[30, 20, 10, 5, 2.5].map((hp) => (
                      <span key={hp} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        {hp}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">محركات خفيفة الوزن وسهلة الحمل، مثالية للقوارب الصغيرة وقوارب الصيد. تجمع بين الموثوقية والاقتصاد في استهلاك الوقود.</p>
                <div className="mt-auto">
                  <a href="#quote" className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">استفسر الآن</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">تقنية <span className="text-blue-600">متطورة</span> في كل محرك</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">صممت محركات توهاتسو لتقديم تجربة قيادة مثالية مع موثوقية عالية وأداء متميز</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Japanese Reliability */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-shield-alt text-blue-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">موثوقية يابانية</h3>
              <p className="text-gray-600">مصنعة وفق أعلى معايير الجودة اليابانية، مع ضمان يمتد لخمس سنوات للاستخدام الترفيهي، توفر لك راحة البال.</p>
            </div>
            
            {/* Feature 2 - Exceptional Performance */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-tachometer-alt text-green-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">أداء استثنائي</h3>
              <p className="text-gray-600">نسبة قوة إلى وزن هي الأفضل في فئتها، مما يوفر تسارعًا مثاليًا وسرعات قصوى عالية مع استهلاك وقود منخفض.</p>
            </div>
            
            {/* Feature 3 - Lightweight */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-feather-alt text-orange-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">خفيفة الوزن</h3>
              <p className="text-gray-600">تصميم خفيف الوزن وقوي في نفس الوقت، يجعل من محركات توهاتسو الخيار الأمثل للقوارب من جميع الأحجام.</p>
            </div>
            
            {/* Feature 4 - Fuel Efficiency */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-gas-pump text-red-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">كفاءة في استهلاك الوقود</h3>
              <p className="text-gray-600">تقنية حقن الوقود الإلكتروني (EFI) توفر استهلاكًا أمثل للوقود وتقلل من الانبعاثات الضارة بالبيئة.</p>
            </div>
            
            {/* Feature 5 - Easy Maintenance */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-tools text-yellow-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">سهولة الصيانة</h3>
              <p className="text-gray-600">تصميم يراعي سهولة الوصول إلى مكونات المحرك لإجراء الصيانة الدورية بسرعة وسهولة دون الحاجة لأدوات خاصة.</p>
            </div>
            
            {/* Feature 6 - Quiet Operation */}
            <div className="bg-white p-8 rounded-xl shadow-md feature-card reveal fade-bottom">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-volume-mute text-purple-600 text-2xl feature-icon"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">تشغيل هادئ</h3>
              <p className="text-gray-600">نظام عادم عبر المروحة يوفر تجربة إبحار هادئة مع تقليل الاهتزازات لراحة أكبر على متن القارب.</p>
            </div>
          </div>
          
          <div className="text-center mt-12 reveal fade-bottom">
            <a href="#quote" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg">
              <i className="fas fa-calculator text-xl ml-2"></i>
              احصل على عرض سعر خاص
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Carousel */}
      <section id="testimonials" className="py-20 bg-gradient-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/hero.webp"
            alt="توهاتسو - خلفية"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold mb-4">ماذا يقول <span className="text-yellow-400">عملاؤنا</span> عنا</h2>
            <p className="text-xl max-w-3xl mx-auto">استمع إلى تجارب مالكي القوارب السعوديين مع محركات توهاتسو في مياه المملكة</p>
          </div>
          
          {/* Swiper Carousel */}
          <div className="reveal fade-bottom">
            <Swiper
              modules={[EffectCoverflow, Pagination, Autoplay]}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              speed={800}
              className="testimonialSwiper"
            >
              {/* Testimonial 1 */}
              <SwiperSlide className="bg-white text-gray-800 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    م
                  </div>
                  <div className="mr-4">
                    <h4 className="font-bold text-lg">محمد العتيبي</h4>
                    <p className="text-gray-600">الرياض</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                </div>
                <p className="italic">&quot;استخدمت محرك توهاتسو 50 حصان لقاربي منذ 3 سنوات في رحلات الصيد بالخليج العربي، ولم يخذلني أبداً. خفيف الوزن وموفر للوقود بشكل ملحوظ مقارنة بمحركي السابق.&quot;</p>
              </SwiperSlide>
              
              {/* Testimonial 2 */}
              <SwiperSlide className="bg-white text-gray-800 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    ع
                  </div>
                  <div className="mr-4">
                    <h4 className="font-bold text-lg">عبدالله الشمري</h4>
                    <p className="text-gray-600">جدة</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star-half-alt text-yellow-400"></i>
                </div>
                <p className="italic">&quot;محرك توهاتسو 90 حصان هو أفضل استثمار قمت به لقاربي. قوي ويعمل بصمت رائع، وخدمة ما بعد البيع ممتازة. الصيانة سهلة وقطع الغيار متوفرة دائماً.&quot;</p>
              </SwiperSlide>
              
              {/* Testimonial 3 */}
              <SwiperSlide className="bg-white text-gray-800 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    س
                  </div>
                  <div className="mr-4">
                    <h4 className="font-bold text-lg">سعيد الغامدي</h4>
                    <p className="text-gray-600">الدمام</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                  <i className="fas fa-star text-yellow-400"></i>
                </div>
                <p className="italic">&quot;أمتلك محرك توهاتسو 15 حصان لقارب الصيد الصغير، ورغم حجمه الصغير إلا أنه قوي بشكل مدهش. سهل الحمل والتخزين، والاقتصادية في استهلاك الوقود تجعله مثالياً للرحلات الطويلة.&quot;</p>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      {/* Technology Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">تقنيات <span className="text-blue-600">متطورة</span> في كل تفصيل</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">محركات توهاتسو مصممة لتقديم تجربة إبحار لا مثيل لها من خلال أحدث التقنيات اليابانية</p>
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

      {/* Call to Action with Statistics */}
      <section className="py-20 bg-gray-900 text-white relative">
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
            <p className="text-xl mb-8 max-w-4xl mx-auto">ثق في توهاتسو، العلامة التجارية الرائدة في مجال المحركات البحرية على مستوى العالم. محركاتنا مصممة خصيصًا لتتحمل ظروف الإبحار الصعبة في المياه السعودية.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold text-yellow-400 mb-2">+50</div>
                <p>سنة من الخبرة</p>
              </div>
              <div className="text-center p-6 bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold text-yellow-400 mb-2">2</div>
                <p>سنوات ضمان</p>
              </div>
              <div className="text-center p-6 bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold text-yellow-400 mb-2">1</div>
                <p>مراكز خدمة في المملكة</p>
              </div>
              <div className="text-center p-6 bg-gray-800 rounded-lg">
                <div className="text-4xl font-bold text-yellow-400 mb-2">+1000</div>
                <p>عميل راضٍ</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Request Section */}
      <section id="quote" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 reveal fade-bottom">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">احصل على <span className="text-blue-600">عرض سعر خاص</span></h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">احصل على أفضل الأسعار لمحركات توهاتسو واستمتع بعروض حصرية مصممة خصيصاً لاحتياجاتك</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-xl shadow-lg reveal fade-right">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">احصل على عرض سعر مخصص</h3>
                  <p className="text-gray-600 mb-8">املأ النموذج وسنتواصل معك خلال 24 ساعة بأفضل عرض سعر</p>
                  
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
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input" 
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
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input" 
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
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
                          required
                        >
                          <option value="">-- اختر الموديل --</option>
                          <option value="MFS 140 حصان">MFS 140 حصان</option>
                          <option value="MFS 115 حصان">MFS 115 حصان</option>
                          <option value="MFS 100 حصان">MFS 100 حصان</option>
                          <option value="MFS 90 حصان">MFS 90 حصان</option>
                          <option value="MFS 75 حصان">MFS 75 حصان</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2 font-semibold" htmlFor="city">المدينة *</label>
                        <select 
                          id="city" 
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
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
                        <label className={`relative cursor-pointer ${usage === 'ترفيهي' ? 'ring-2 ring-blue-500' : ''}`}>
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
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }`}>
                            <div className="flex flex-col items-center">
                              <i className={`fas fa-ship text-2xl mb-2 ${
                                usage === 'ترفيهي' ? 'text-blue-600' : 'text-gray-400'
                              }`}></i>
                              <span className="font-medium">ترفيهي</span>
                              <span className="text-xs text-gray-500 mt-1">رحلات عائلية</span>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`relative cursor-pointer ${usage === 'صيد' ? 'ring-2 ring-blue-500' : ''}`}>
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
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }`}>
                            <div className="flex flex-col items-center">
                              <i className={`fas fa-fish text-2xl mb-2 ${
                                usage === 'صيد' ? 'text-blue-600' : 'text-gray-400'
                              }`}></i>
                              <span className="font-medium">صيد</span>
                              <span className="text-xs text-gray-500 mt-1">رحلات الصيد</span>
                            </div>
                          </div>
                        </label>
                        
                        <label className={`relative cursor-pointer ${usage === 'تجاري' ? 'ring-2 ring-blue-500' : ''}`}>
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
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }`}>
                            <div className="flex flex-col items-center">
                              <i className={`fas fa-anchor text-2xl mb-2 ${
                                usage === 'تجاري' ? 'text-blue-600' : 'text-gray-400'
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
                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input"
                      ></textarea>
                    </div>
                    
                    <div className="mb-6 flex items-start">
                      <input 
                        type="checkbox" 
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="ml-2 h-5 w-5 text-blue-600 mt-1" 
                        required 
                      />
                      <label htmlFor="agreeToTerms" className="text-gray-700">أوافق على شروط الخدمة وتلقي عروض الأسعار *</label>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-4 rounded-lg transition duration-300 flex items-center justify-center text-lg shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <i className="fas fa-spinner fa-spin text-xl ml-2"></i>
                          جاري الإرسال...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane text-xl ml-2"></i>
                          احصل على عرض السعر الآن
                        </>
                      )}
                    </button>
                    
                    <p className="text-center text-gray-500 text-sm mt-4">
                      سنتواصل معك خلال 24 ساعة
                    </p>
                  </form>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="lg:col-span-1">
                <div className="space-y-6 reveal fade-left">
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-fire text-red-600 text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">عرض محدود</h4>
                    <p className="text-gray-600">خصم حتى 15% هذا الشهر</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-clock text-blue-600 text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">رد سريع</h4>
                    <p className="text-gray-600">خلال 24 ساعة</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-tags text-yellow-600 text-2xl"></i>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">أفضل الأسعار</h4>
                    <p className="text-gray-600">عروض حصرية</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
          <Image
                src="https://www.tohatsu.com/all/logo_allTop.png"
                alt="توهاتسو"
                width={120}
                height={48}
                className="h-12 w-auto mb-6"
              />
              <p className="text-gray-400 mb-6">توهاتسو، شريكك في المياه السعودية منذ أكثر من 10 سنوات. نقدم أفضل المحركات البحرية بجودة عالية وخدمة ممتازة.</p>
              <div className="flex space-x-4 space-x-reverse">
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-600 transition duration-300">
                  <i className="fab fa-facebook-f text-white"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-400 transition duration-300">
                  <i className="fab fa-twitter text-white"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-600 transition duration-300">
                  <i className="fab fa-instagram text-white"></i>
                </a>
                <a href="#" className="bg-white bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600 transition duration-300">
                  <i className="fab fa-youtube text-white"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">روابط سريعة</h4>
              <ul className="space-y-3">
                <li><a href="#home" className="text-gray-400 hover:text-white transition duration-300">الرئيسية</a></li>
                <li><a href="#products" className="text-gray-400 hover:text-white transition duration-300">المنتجات</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition duration-300">المميزات</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition duration-300">آراء العملاء</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition duration-300">اتصل بنا</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">المنتجات</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">محركات متوسطة المدى (25-140)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">محركات محمولة (2.5-20)</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">قطع الغيار</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">الإكسسوارات</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6">الدعم</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">مراكز الخدمة</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">الضمان</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">الأسئلة الشائعة</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">تحميل الكتالوجات</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-center md:text-right">© 2025 توهاتسو السعودية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
