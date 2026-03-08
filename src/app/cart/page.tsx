"use client";

import { motion } from "framer-motion";
import { Trash2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";

const Cart = () => {
  const { cart, updateQty, removeFromCart, getCartTotal } = useCartStore();

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-3xl md:text-4xl mb-8"
          >
            Your Cart
          </motion.h1>

          {cart.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">Your cart is empty</p>
              <Link href="/shop"><Button>Continue Shopping</Button></Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-card card-hover"
                  >
                    <img
                      src={(item.product.images && item.product.images.length > 0 ? item.product.images[0] : item.product.image) || "/assets/placeholder.png"}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-sm md:text-base truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-primary font-display font-bold">
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 border border-input rounded-xl p-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQty(item.product.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold">{item.qty}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => updateQty(item.product.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button size="icon" variant="ghost" className="text-destructive h-9 w-9" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 glass rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display font-semibold text-lg">Total</span>
                  <span className="font-display font-bold text-2xl text-primary">
                    ₹{getCartTotal().toLocaleString()}
                  </span>
                </div>
                <Link href="/checkout">
                  <Button variant="default" size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Cart;
