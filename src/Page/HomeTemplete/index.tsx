import React from "react";
import Banner from "./Componnent/Banner";
import Headder from "./Componnent/Headder";
import { Outlet } from "react-router-dom";
import { Example } from "./Componnent/Carousel";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <header className="p-6">
        <h1 className="text-4xl font-bold">Home Page</h1>
      </header>
      <div className="space-y-16">
        <Headder />
        <Example />
        <Outlet />
      </div>
    </div>
  );
}
