import React from "react";
import Header from "../Common/Header";
import Topbar from "./Topbar";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

import Loader from "../Common/Loader";

function UserLayout() {
  return (
    <>
      <header className="border-b sticky top-0 z-50 bg-white">
        <Topbar />
        <Navbar />
      </header>
      <main>
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer Section */}
      <Footer />
    </>
  );
}

export default UserLayout;
