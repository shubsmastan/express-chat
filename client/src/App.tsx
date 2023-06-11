import { useState } from "react";
import LogIn from "./components/LogIn";
import Footer from "./components/Footer";
import Header from "./components/Header";

export default function App() {
  return (
    <div className="flex flex-col justify-between items-center min-h-screen w-screen bg-indigo-200">
      <Header />
      <LogIn />
      <Footer />
    </div>
  );
}
