import React from 'react';
import { Link } from 'react-router-dom';

function Banner() {
  return (
    <section className="w-full">
      <Link to="/collection/men" className="block w-full">
        <div className="relative w-full overflow-hidden">
          <img
            src="https://cdn.shopify.com/s/files/1/0798/9710/0596/files/new_Icon_Banner_-_men_-_revised_copy.jpg?v=1768469107"
            alt="Men's Collection"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      </Link>
    </section>
  );
}

export default Banner;
