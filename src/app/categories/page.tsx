"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import Categories from "@/components/Categories";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20">
        <Categories />
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CategoriesPage;
