"use client";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const sortOptions = ["Default", "Price: Low to High", "Price: High to Low"];

const ShopContent = () => {
  const searchParams = useSearchParams();
  const defaultCategorySlug = searchParams.get("category");

  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCategorySlug, setActiveCategorySlug] = useState("all");
  const [sortBy, setSortBy] = useState("Default");
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  const { data: fetchedProducts, isLoading: isProductsLoading } = useProducts();
  const products = fetchedProducts || [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success) {
          setCategories(json.data);

          if (defaultCategorySlug) {
            const matchedCategory = json.data.find((c: Category) => c.slug === defaultCategorySlug);
            if (matchedCategory) {
              setActiveCategory(matchedCategory.name);
              setActiveCategorySlug(matchedCategory.slug);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [defaultCategorySlug]);

  const handleCategorySelect = (name: string, slug: string) => {
    setActiveCategory(name);
    setActiveCategorySlug(slug);
  };

  // The product model might have category as a string (name or ObjectId)
  // We'll filter based on category slug if available, else fallback to ObjectId match if possible,
  // but let's assume `useProducts` returns populated categories or raw ObjectIds.
  // Judging by original code `p.category === activeCategory`, it seems products hold category Names or IDs.
  // Actually, wait, let's keep it robust. If original code used `activeCategory` (name), we filter by name.
  // But wait, the database usually stores the `category` id or name. 
  // Let's filter by checking if product.category matches the active category name.
  let filtered = activeCategory === "All" ? products : products.filter((p: any) => p.category === activeCategory || (p.category && p.category.name === activeCategory) || (p.category && p.category._id === activeCategorySlug));

  if (sortBy === "Price: Low to High") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortBy === "Price: High to Low") filtered = [...filtered].sort((a, b) => b.price - a.price);

  const isLoading = isProductsLoading || isCategoriesLoading;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="font-display font-bold text-3xl md:text-5xl">Our Shop</h1>
            <p className="text-muted-foreground mt-2">
              Discover our curated collection of aquatic life & accessories
            </p>
          </motion.div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
            <div className="flex flex-wrap gap-2 items-center">
              {isCategoriesLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Button
                    variant={activeCategory === "All" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategorySelect("All", "all")}
                  >
                    All
                  </Button>
                  {categories.map((cat) => (
                    <Button
                      key={cat._id}
                      variant={activeCategory === cat.name ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategorySelect(cat.name, cat._id)}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </>
              )}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl border border-input bg-background text-sm font-display focus:ring-2 focus:ring-ring"
            >
              {sortOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((product: any, i: number) => {
                const productData = { ...product, id: product._id || product.id };
                return (
                  <motion.div
                    key={productData.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard product={productData} />
                  </motion.div>
                );
              })}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-20">No products found in this category.</p>
          )}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

const Shop = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <ShopContent />
    </Suspense>
  )
}

export default Shop;
