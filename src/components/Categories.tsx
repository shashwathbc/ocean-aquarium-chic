"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import categoryAquariums from "@/assets/category-aquariums.jpg";
import categoryFish from "@/assets/category-fish.jpg";
import categoryPlants from "@/assets/category-plants.jpg";
import categoryFilters from "@/assets/category-filters.jpg";
import categoryLighting from "@/assets/category-lighting.jpg";
import categoryDecorations from "@/assets/category-decorations.jpg";

const categories = [
  { name: "Aquariums", image: categoryAquariums },
  { name: "Exotic Fish", image: categoryFish },
  { name: "Aquarium Plants", image: categoryPlants },
  { name: "Filters", image: categoryFilters },
  { name: "Lighting", image: categoryLighting },
  { name: "Decorations", image: categoryDecorations },
];

const Categories = () => {
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                href="/shop"
                className="group relative block aspect-[4/3] rounded-2xl overflow-hidden card-hover"
              >
                <img
                  src={typeof cat.image === 'object' && 'src' in cat.image ? (cat.image as any).src : cat.image as string}
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
      </div>
    </section>
  );
};

export default Categories;
