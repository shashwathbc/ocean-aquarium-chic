import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { products } from "@/components/FeaturedProducts";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);
  const { addToCart, cart } = useCart();
  const navigate = useNavigate();
  const inCart = cart.some((item) => item?.product?.id === product?.id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-display text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden aspect-square"
            >
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <span className="text-xs font-display text-muted-foreground uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="font-display font-bold text-3xl md:text-4xl mt-2 mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-display font-bold text-primary mb-6">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Premium quality {product.name.toLowerCase()} sourced from trusted breeders. Perfect for home and office aquariums. Comes with care guide and health guarantee.
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
                <span className="font-display font-semibold text-sm">Quantity</span>
                <div className="flex items-center gap-2 border border-input rounded-xl p-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-display font-semibold">{qty}</span>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(qty + 1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {inCart ? (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => navigate("/cart")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Go to Cart
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1"
                    onClick={() => addToCart(product, qty)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                  </Button>
                )}
                <Button
                  variant="coral"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    addToCart(product, qty);
                    navigate("/cart");
                  }}
                >
                  Buy Now
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display font-bold text-2xl mb-8">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default ProductDetail;
