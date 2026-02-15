import React from "react";
import Hero from "../components/Layout/Hero";
import Banner from "../components/Layout/Banner";
import GenderCollection from "../components/Products/GenderCollection";
import NewArrivals from "../components/Products/NewArrivals";
import CategoryGrid from "../components/Products/CategoryGrid";
import TrendingStrip from "../components/Products/TrendingStrip";
import BestSellersCarousel from "../components/Products/BestSellersCarousel";
import FeaturedProducts from "../components/Products/FeaturedProducts";
import PromoBanners from "../components/Layout/PromoBanners";
import ShoppableVideoCarousel from "../components/Products/ShoppableVideoCarousel";
import BrandFeatures from "../components/Layout/BrandFeatures";
import Newsletter from "../components/Layout/Newsletter";
import JeansEditScroll from "../components/Products/JeansEditScroll";
import DealGrid from "../components/Products/DealGrid";

function Home() {
  return (
    <div>
      {/* 1. Hero Banner Carousel */}
      <Hero />

      {/* 2. Category Grid (6 categories in a strip) */}
      <CategoryGrid />

      {/* 3. Gender Collection (MEN / WOMEN) */}
      <GenderCollection />

      {/* 4. Trending Strip (Best Picks / New Launches / Trending) */}
      <TrendingStrip />

      {/* 5. Best Sellers Carousel */}
      <BestSellersCarousel />

      {/* 6. Promotional Banners (Oversized / Hoodies) */}
      <PromoBanners />

      {/* 7. New Arrivals Horizontal Scroll */}
      <NewArrivals />

      {/* 8. Deal Grid (Bewakoof Style) */}
      <DealGrid />

      {/* 7.5 Jeans Edit Scroll (Bewakoof Style) */}
      {/* <JeansEditScroll /> */}

      {/* 8. Main Banner */}
      <Banner />

      {/* 9. Shoppable Video Carousel */}
      <ShoppableVideoCarousel />

      {/* 10. Featured Products Grid */}
      <FeaturedProducts />

      {/* 11. Brand Features (Shipping, Quality, etc.) */}
      <BrandFeatures />

      {/* 12. Newsletter */}
      <Newsletter />
    </div>
  );
}

export default Home;
