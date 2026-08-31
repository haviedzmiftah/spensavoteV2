import HeroSection from "@/components/HeroSection";
import InfoSection from "@/components/InfoSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with Auto-slide Paslon Carousel */}
      <HeroSection />

      {/* 2. Info Section: Cara Memilih, Daftar Paslon & Timeline Pemilu */}
      <InfoSection />
    </div>
  );
}
