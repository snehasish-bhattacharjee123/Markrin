import React from "react";
import { Link } from "react-router-dom";

const DealGrid = () => {
    const deals = [
        {
            src: "https://images.bewakoof.com/uploads/grid/app/639x608-StealDeals-men-oversized-1770993066.jpg",
            alt: "Buy 2 OS Men at 1099",
            link: "/collection/oversized",
        },
        {
            src: "https://images.bewakoof.com/uploads/grid/app/639x608-StealDeals-men-joggers-1770993065.jpg",
            alt: "Buy 2 Joggers for Men at 1699",
            link: "/collection/joggers",
        },
        {
            src: "https://images.bewakoof.com/uploads/grid/app/639x608-StealDeals-men-under599-1770993066.jpg",
            alt: "Under 599 Store",
            link: "/collection/under-599",
        },
    ];

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-3 gap-0">
                {deals.map((deal, index) => (
                    <div key={index} className="w-full">
                        <Link to={deal.link} className="block w-full">
                            <img
                                src={deal.src}
                                alt={deal.alt}
                                loading="lazy"
                                className="w-full h-auto object-cover hover:opacity-95 transition-opacity duration-300"
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DealGrid;
