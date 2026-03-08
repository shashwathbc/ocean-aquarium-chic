"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ui/use-toast";

const ProductDetail = () => {
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const { toast } = useToast();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const { cart, addToCart } = useCartStore();

  const { data: fetchedProducts, isLoading } = useProducts();
  const products = fetchedProducts || [];

  const product = products.find((p: any) => p.id === id || p._id === id);

  const [activeMedia, setActiveMedia] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-display font-medium text-muted-foreground">Product not found.</p>
        <Link href="/shop" className="text-primary hover:underline">Return to Shop</Link>
      </div>
    );
  }

  // Ensure consistent ID for cart operations
  const productId = product._id || product.id;
  const cartItem = cart.find(item => (item.product._id || item.product.id) === productId);

  const related = products.filter((p: any) => p.category === product.category && (p.id !== productId && p._id !== productId)).slice(0, 4);

  const media = [
    { type: 'video', url: 'https://cdn.pixabay.com/video/2016/08/22/4762-181514781_tiny.mp4' },
    { type: 'image', url: typeof product.image === 'object' && 'src' in product.image ? (product.image as any).src : product.image as string },
    { type: 'image', url: 'https://images.unsplash.com/photo-1544253018-b2031a0aaeaf?q=80&w=600' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1522069169874-c58ced4e0cd0?q=80&w=600' }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4">
          <Link href="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-display text-base">
            <ArrowLeft className="h-5 w-5" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-4 sticky top-32"
            >
              <div className="rounded-3xl overflow-hidden aspect-square md:aspect-[4/3] relative bg-muted flex items-center justify-center shadow-lg border border-border/50">
                {media[activeMedia].type === 'video' ? (
                  <video src={media[activeMedia].url as string} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                ) : (
                  <img src={media[activeMedia].url as string} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {media.map((m, idx) => (
                  <button key={idx} onClick={() => setActiveMedia(idx)} className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all duration-300 ${activeMedia === idx ? 'border-primary scale-105 shadow-md shadow-primary/20' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[1.02]'}`}>
                    {m.type === 'video' ? (
                      <video src={m.url} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <img src={m.url} className="w-full h-full object-cover" />
                    )}
                    {m.type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black/20"><span className="w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center pl-1 text-black text-xs">▶</span></div>}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <span className="text-sm font-display text-primary uppercase tracking-widest font-bold">
                {product.category}
              </span>
              <h1 className="font-display font-black text-4xl md:text-5xl lg:text-6xl mt-3 mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl lg:text-4xl font-display font-bold text-primary mb-8 drop-shadow-sm">
                ₹{product.price.toLocaleString()}
              </p>
              <p className="text-foreground/80 leading-relaxed mb-10 text-lg">
                Premium quality {product.name.toLowerCase()} sourced from trusted breeders. Perfect for home and office aquariums. Comes with care guide and health guarantee.
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-6 mb-8">
                <span className="font-display font-bold text-lg">Quantity</span>
                <div className="flex items-center gap-3 border border-border/60 bg-muted/30 rounded-2xl p-1 shadow-sm">
                  <Button size="icon" variant="ghost" className="h-10 w-10 md:h-12 md:w-12 rounded-xl hover:bg-background shadow-sm hover:shadow-md transition-all" onClick={() => setQty(Math.max(1, qty - 1))}>
                    <Minus className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                  <span className="w-10 md:w-12 text-center font-display font-bold text-xl md:text-2xl">{qty}</span>
                  <Button size="icon" variant="ghost" className="h-10 w-10 md:h-12 md:w-12 rounded-xl hover:bg-background shadow-sm hover:shadow-md transition-all" onClick={() => setQty(Math.min(10, qty + 1))}>
                    <Plus className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button
                  variant={cartItem ? "secondary" : "default"}
                  size="lg"
                  className={`flex-1 py-7 text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ${cartItem ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20 hover:text-green-700 shadow-green-500/10' : 'shadow-primary/20'}`}
                  onClick={() => {
                    addToCart(product, qty);
                    // CartProvider already handles toast.success but we can keep it silent here or let contexts handle it
                  }}
                >
                  <ShoppingCart className="h-6 w-6 mr-3" />
                  {cartItem ? "Update Cart Quantity" : "Add to Cart"}
                </Button>
                <Link href="/checkout" className="flex-1 flex">
                  <Button
                    variant="coral"
                    size="lg"
                    className="w-full py-7 text-lg font-bold shadow-xl shadow-accent/20 hover:scale-105 active:scale-95 transition-all duration-300"
                    onClick={() => addToCart(product, qty)}
                  >
                    Buy Now
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display font-bold text-2xl mb-8">Related Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p: any) => {
                  const productData = { ...p, id: p._id || p.id };
                  return <ProductCard key={productData.id} product={productData} />;
                })}
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
