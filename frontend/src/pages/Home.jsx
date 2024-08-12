import React from "react";
import Sidebar from "../components/home/Sidebar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col md:flex-row gap-1 h-auto">
      <div className="w-full md:w-1/5 border border-gray-500 rounded p-4">
        <Sidebar />
      </div>
      <div className="w-full md:w-4/5 border border-gray-500 rounded p-4">
        <Outlet/>
      </div>
    </div>
  );
};

export default Home;
