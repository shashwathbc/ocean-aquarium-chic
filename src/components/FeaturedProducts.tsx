import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

import productBetta from "@/assets/product-betta.jpg";
import productNeontetra from "@/assets/product-neontetra.jpg";
import productClownfish from "@/assets/product-clownfish.jpg";
import productTank from "@/assets/product-tank.jpg";
import productJavamoss from "@/assets/product-javamoss.jpg";
import productLed from "@/assets/product-led.jpg";
import productDiscus from "@/assets/product-discus.jpg";
import productAnubias from "@/assets/product-anubias.jpg";

export const products = [
  { id: "1", name: "Red Betta Fish", price: 499, image: productBetta, category: "Exotic Fish" },
  { id: "2", name: "Neon Tetra (Pack of 10)", price: 350, image: productNeontetra, category: "Exotic Fish" },
  { id: "3", name: "Clownfish Pair", price: 1200, image: productClownfish, category: "Exotic Fish" },
  { id: "4", name: "Rimless Glass Tank 60cm", price: 4500, image: productTank, category: "Aquariums" },
  { id: "5", name: "Java Moss Bunch", price: 120, image: productJavamoss, category: "Aquarium Plants" },
  { id: "6", name: "Pro LED Light Bar", price: 2800, image: productLed, category: "Lighting" },
  { id: "7", name: "Blue Discus Fish", price: 3500, image: productDiscus, category: "Exotic Fish" },
  { id: "8", name: "Anubias Nana on Rock", price: 250, image: productAnubias, category: "Aquarium Plants" },
];

const FeaturedProducts = () => {
  const { data: fetchedProducts, isLoading, error } = useProducts();

  return (
    <section className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-primary font-display font-semibold text-sm tracking-widest uppercase">
            Curated Selection
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-2">
            Featured Products
          </h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="font-display text-muted-foreground animate-pulse">Loading amazing products...</span>
          </div>
        ) : error ? (
          <div className="text-center text-destructive py-10">Failed to load products.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {fetchedProducts?.map((product: any, i: number) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
