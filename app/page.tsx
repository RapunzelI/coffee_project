'use client';

import { useRouter } from 'next/navigation';
import { Button } from 'antd';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/customer_order');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/espresso-coffee.png"
          alt="Espresso Coffee"
          fill
          className="object-cover object-center "
          style={{
            objectPosition: 'center',
          }}
          priority
          sizes="100vw"
          quality={100}
        />
        {/* Dark Overlay - เข้มขึ้นในมือถือ */}
        <div className="absolute inset-0 bg-black/20 sm:bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-0">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-4xl w-full">
          {/* Title - Responsive text sizes */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-tight"
            style={{ color: '#C67C4E' }}
          >
            Coffee Shop
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light px-4">
            สั่งกาแฟสดใหม่ทุกวัน
          </p>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-xs sm:max-w-md md:max-w-lg mx-auto px-4 leading-relaxed">
            เริ่มต้นวันใหม่ของคุณด้วยกาแฟคุณภาพดีที่สุด
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            สั่งง่าย รวดเร็ว ได้เครื่องดื่มที่ใช่
          </p>

          {/* Get Started Button - Responsive sizes */}
          <div className="pt-4 sm:pt-6 md:pt-8">
            <Button
              type="primary"
              size="large"
              onClick={handleGetStarted}
              style={{
                backgroundColor: '#C67C4E',
                borderColor: '#C67C4E',
                fontWeight: 'bold',
                borderRadius: '12px',
              }}
              className="h-12 sm:h-14 md:h-16 text-base sm:text-lg md:text-xl px-8 sm:px-12 md:px-16 hover:opacity-90 transition-opacity w-full max-w-xs sm:w-auto"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-black/80 to-transparent z-5" />
    </div>
  );
}