import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";



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
            {fetchedProducts?.slice(0, 8).map((product: any, i: number) => {
              const productData = { ...product, id: product._id || product.id };
              return (
                <motion.div
                  key={productData.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <ProductCard product={productData} />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
