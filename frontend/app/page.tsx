import BestSeller from "@/components/home/BestSeller";
import FeaturesSection from "@/components/home/Features";
import HeroSection from "@/components/home/HeroSection";
import JustLanded from "@/components/home/JustLanded";
import ShopBanner from "@/components/home/ShopBanner";
import { getJustLandedProducts } from "@/lib/api";

export default async function HomePage() {
  const products = await getJustLandedProducts();

  return (
    <>
      <HeroSection />
      <JustLanded products={products}/>
      <BestSeller products={products} />
      <ShopBanner title={"Top Picks By The Stars"} image={"/images/banner_image1.jpg"} href={"/shop"} />
      <FeaturesSection />
    </>
  );
}
