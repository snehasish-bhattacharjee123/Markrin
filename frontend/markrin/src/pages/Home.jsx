import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/Products/GenderCollection";
import NewArrivals from "../components/Products/NewArrivals";
import FeaturedCategories from "../components/Products/FeaturedCategories";
import FeaturedProducts from "../components/Products/FeaturedProducts";
import BrandFeatures from "../components/Layout/BrandFeatures";
import Newsletter from "../components/Layout/Newsletter";

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <NewArrivals />
      <GenderCollection />
      <FeaturedProducts />
      <BrandFeatures />
      <Newsletter />
    </div>
  );
}

export default Home;
