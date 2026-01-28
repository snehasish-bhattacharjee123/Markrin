import React from "react";
import {
  HiArrowPath,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";

function FeaaturesSection() {
  return (
    <section className="py-16 px-4 bg-brand-light-gray">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Left Image Container */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 rounded-full mb-4">
            <HiShoppingBag className="text-xl text-brand-dark-brown" />
          </div>
          <h4 className="tracking-tighter mb-2 ">Free Shipping</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            On all orders over $50
          </p>
        </div>
        {/* Featured 2 */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 rounded-full mb-4">
            <HiArrowPath className="text-xl text-brand-dark-brown" />
          </div>
          <h4 className="tracking-tighter mb-2 ">45 Days returns</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            Money Back Garuntee
          </p>
        </div>
        {/* Featured 3 */}
        <div className="flex flex-col items-center justify-center">
          <div className="p-4 rounded-full mb-4">
            <HiOutlineCreditCard className="text-xl text-brand-dark-brown" />
          </div>
          <h4 className="tracking-tighter mb-2 ">SECURE CHECKOUT</h4>
          <p className="text-gray-600 text-sm tracking-tighter">
            100 % secure payment
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaaturesSection;
