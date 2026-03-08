"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        if (json.success) {
          // Limit to 6 categories for the homepage aesthetic
          setCategories(json.data.slice(0, 6));
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-display font-semibold text-sm tracking-widest uppercase">
            Browse
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">
            Shop by Category
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-muted-foreground h-48 flex items-center justify-center">
            No categories available. Add some in the admin panel!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group relative block aspect-[4/3] rounded-2xl overflow-hidden card-hover"
                >
                  <img
                    src={cat.image || "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image"}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,50%,10%,0.8)] via-[hsl(210,50%,10%,0.2)] to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                    <h3 className="font-display font-bold text-lg md:text-xl text-[hsl(0,0%,100%)]">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
