import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa'; // Fixed: Imported FaBars
import { Outlet } from 'react-router-dom'; // Fixed: Imported Outlet
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      
      {/* Mobile Toggle Bar */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white items-center justify-between">
        <button onClick={toggleSideBar} className="focus:outline-none">
          <FaBars size={24} />
        </button>
        <h1 className="text-xl font-medium">Admin Dashboard</h1>
        <div className="w-6"></div> {/* Spacer for centering logic */}
      </div>

      {/* Overlay for mobile Sidebar */}
      {isSideBarOpen && (
        <div 
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" 
          onClick={toggleSideBar} // Fixed: onClick moved into tag attributes
        />
      )}

      {/* Sidebar */}
      <div className={`
        bg-gray-900 w-64 min-h-screen text-white absolute md:relative z-20
        transform transition-transform duration-300 ease-in-out
        ${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
      `}>
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6 overflow-auto bg-gray-100">
        <Outlet /> {/* This will render the specific admin pages */}
      </div>

    </div>
  );
};

export default AdminLayout;
