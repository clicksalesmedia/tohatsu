'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        href="https://wa.me/966XXXXXXXXX" 
        target="_blank" 
        rel="noopener noreferrer" 
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
                <a href="#contact" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-bold hover:bg-white hover:text-blue-900 transition duration-300 text-center">تواصل معنا</a>
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
                  <span className="text-yellow-500 text-lg font-bold">25-140 حصان</span>
                  <div className="h-1 w-1 bg-gray-300 rounded-full mx-2"></div>
                  <span className="text-gray-600">للقوارب المتوسطة</span>
                </div>
                
                {/* Horsepower Table */}
                <div className="mb-4 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 text-center">القوة المتاحة (حصان)</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[140, 115, 100, 90, 75, 60].map((hp) => (
                      <span key={hp} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {hp}
                      </span>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">مجموعة متنوعة من المحركات رباعية الأشواط التي تجمع بين الأداء المتميز والاقتصاد في استهلاك الوقود، مثالية للاستخدامات المتنوعة.</p>
                <div className="mt-auto">
                  <a href="#contact" className="block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">استفسر الآن</a>
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
                  <a href="#contact" className="block text-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">استفسر الآن</a>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal fade-right">
              <h2 className="text-4xl font-bold mb-6">اختر الأفضل <span className="text-yellow-400">لقاربك</span></h2>
              <p className="text-xl mb-8">ثق في توهاتسو، العلامة التجارية الرائدة في مجال المحركات البحرية على مستوى العالم. محركاتنا مصممة خصيصًا لتتحمل ظروف الإبحار الصعبة في المياه السعودية.</p>
              <div className="grid grid-cols-2 gap-6 mb-10">
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
              <a href="#contact" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105">تواصل معنا الآن</a>
            </div>
            
            <div className="reveal fade-left">
              <div className="bg-white p-8 rounded-xl text-gray-800">
                <h3 className="text-2xl font-bold mb-6 text-center">احصل على عرض سعر خاص</h3>
                <form>
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="model">اختر موديل المحرك</label>
                    <select id="model" className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input">
                      <option value="">-- اختر الموديل --</option>
                      <option value="250hp">BFT 250 حصان</option>
                      <option value="200hp">MFS 200 حصان</option>
                      <option value="140hp">MFS 140 حصان</option>
                      <option value="115hp">MFS 115 حصان</option>
                      <option value="90hp">MFS 90 حصان</option>
                      <option value="60hp">MFS 60 حصان</option>
                      <option value="40hp">MFS 40 حصان</option>
                      <option value="30hp">MFS 30 حصان</option>
                      <option value="20hp">MFS 20 حصان</option>
                      <option value="15hp">MFS 15 حصان</option>
                      <option value="9.9hp">MFS 9.9 حصان</option>
                      <option value="6hp">MFS 6 حصان</option>
                      <option value="other">موديل آخر</option>
                    </select>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="city">المدينة</label>
                    <select id="city" className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input">
                      <option value="">-- اختر المدينة --</option>
                      <option value="riyadh">الرياض</option>
                      <option value="jeddah">جدة</option>
                      <option value="dammam">الدمام</option>
                      <option value="khobar">الخبر</option>
                      <option value="yanbu">ينبع</option>
                      <option value="jubail">الجبيل</option>
                      <option value="other">مدينة أخرى</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300">احصل على عرض السعر</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 reveal fade-bottom">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">تواصل <span className="text-blue-600">معنا</span></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">نحن هنا للإجابة على جميع استفساراتك ومساعدتك في اختيار المحرك المناسب لاحتياجاتك</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg reveal fade-right">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">أرسل استفسارك</h3>
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="name">الاسم الكامل</label>
                    <input type="text" id="name" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input" required />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="phone">رقم الجوال</label>
                    <input type="tel" id="phone" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input" required />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="email">البريد الإلكتروني</label>
                  <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input" required />
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="subject">الموضوع</label>
                  <select id="subject" className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input">
                    <option value="sales">استفسار عن المنتجات</option>
                    <option value="service">خدمة ما بعد البيع</option>
                    <option value="parts">قطع غيار</option>
                    <option value="warranty">استفسار عن الضمان</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="message">الرسالة</label>
                  <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 form-input" required></textarea>
                </div>
                
                <div className="mb-6 flex items-center">
                  <input type="checkbox" id="privacy" className="ml-2 h-5 w-5 text-blue-600" required />
                  <label htmlFor="privacy" className="text-gray-700">أوافق على سياسة الخصوصية وشروط الاستخدام</label>
                </div>
                
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg transition duration-300 flex items-center justify-center">
                  <i className="fas fa-paper-plane ml-2"></i>
                  إرسال الرسالة
                </button>
              </form>
            </div>
            
            {/* Contact Info */}
            <div className="reveal fade-left">
              <div className="mb-12 bg-blue-600 text-white p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-6">معلومات الاتصال</h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-white text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">العنوان</h4>
                      <p>طريق الملك فهد، حي العليا، الرياض، المملكة العربية السعودية</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <i className="fas fa-phone-alt text-white text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">الهاتف</h4>
                      <p>+966 11 123 4567</p>
                      <p>+966 50 987 6543</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <i className="fas fa-envelope text-white text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">البريد الإلكتروني</h4>
                      <p>info@tohatsu-sa.com</p>
                      <p>service@tohatsu-sa.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center ml-4 flex-shrink-0">
                      <i className="fas fa-clock text-white text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">ساعات العمل</h4>
                      <p>السبت - الخميس: 9:00 ص - 6:00 م</p>
                      <p>الجمعة: مغلق</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-wrench text-blue-600 text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">مراكز الخدمة</h4>
                  <p className="text-gray-600">مراكز خدمة معتمدة في جميع أنحاء المملكة للصيانة وقطع الغيار الأصلية</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow border border-gray-200 text-center">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-shield-alt text-blue-600 text-2xl"></i>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">ضمان شامل</h4>
                  <p className="text-gray-600">ضمان لمدة 5 سنوات على جميع محركات توهاتسو للاستخدام الترفيهي</p>
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
                <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">محركات القوة العالية (150-250)</a></li>
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
