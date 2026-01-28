import React from "react";
import Header from "../Common/Header";
import Topbar from "./Topbar";
import Navbar from "../Common/Navbar";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

function UserLayout() {
  return (
    <>
      {/* Header */}
      <header className="border-b ">
        <Topbar />
        <Navbar />
      </header>
      {/* Body Section */}
      <main>
         <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      
      {/* Footer Section */}
      <Footer/>
    </>
  );
}

export default UserLayout;
