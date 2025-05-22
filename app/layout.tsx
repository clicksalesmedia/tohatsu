import './globals.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

export const metadata = {
  title: 'توهاتسو السعودية | تجربة بحرية استثنائية',
  description: 'محركات خارجية متطورة بتقنية يابانية عالية الجودة، صُممت خصيصاً للمياه المحلية والظروف البحرية في المملكة العربية السعودية.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}
