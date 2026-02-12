import React from "react";
import Hero from "../components/Layout/Hero";
import Banner from "../components/Layout/Banner";
import GenderCollection from "../components/Products/GenderCollection";
import NewArrivals from "../components/Products/NewArrivals";
import FeaturedCategories from "../components/Products/FeaturedCategories";
import BestSellersCarousel from "../components/Products/BestSellersCarousel";
import FeaturedProducts from "../components/Products/FeaturedProducts";
import ShoppableVideoCarousel from "../components/Products/ShoppableVideoCarousel";
import BrandFeatures from "../components/Layout/BrandFeatures";
import Newsletter from "../components/Layout/Newsletter";

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <Banner />
      <BestSellersCarousel />
      <NewArrivals />
      <ShoppableVideoCarousel />
      <GenderCollection />
      <FeaturedProducts />
      <BrandFeatures />
      <Newsletter />
    </div>
  );
}

export default Home;
