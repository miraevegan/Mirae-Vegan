import BestSeller from "@/components/home/BestSeller";
import FeaturesSection from "@/components/home/Features";
import HeroSection from "@/components/home/HeroSection";
import JustLanded from "@/components/home/JustLanded";
import ShopBanner from "@/components/home/ShopBanner";
import TestimonialsSection from "@/components/home/Testimonials";
import { getJustLandedProducts, getBestSellerProducts } from "@/lib/api";

export default async function HomePage() {
  const justLandedProducts = await getJustLandedProducts();
  const bestSellerProducts = await getBestSellerProducts();

  return (
    <>
      <HeroSection />
      <JustLanded products={justLandedProducts}/>
      <BestSeller products={bestSellerProducts} />
      <ShopBanner title={"Top Picks By The Stars"} image={"/images/banner_image1.jpg"} href={"/shop"} />
      <FeaturesSection />
      <TestimonialsSection />
    </>
  );
}
