"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Checkout = () => {
  const [submitted, setSubmitted] = useState(false);
  const { clearCart } = useCart();

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-20 flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl mb-2">Order Placed!</h2>
            <p className="text-muted-foreground">We'll contact you on WhatsApp to confirm your order.</p>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-3xl md:text-4xl mb-8"
          >
            Checkout
          </motion.h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              clearCart();
              setSubmitted(true);
            }}
            className="space-y-5"
          >
            <div>
              <label className="font-display font-semibold text-sm mb-1.5 block">Full Name</label>
              <input required className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none" placeholder="Your name" />
            </div>
            <div>
              <label className="font-display font-semibold text-sm mb-1.5 block">Phone Number</label>
              <input required className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="font-display font-semibold text-sm mb-1.5 block">Delivery Address</label>
              <textarea required rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none resize-none" placeholder="Full address in Bangalore" />
            </div>

            <div className="glass rounded-2xl p-5">
              <p className="font-display font-semibold text-sm mb-2">Payment Method</p>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-primary bg-primary/5">
                <div className="h-4 w-4 rounded-full border-2 border-primary flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <span className="font-display font-medium text-sm">Cash on Delivery</span>
              </div>
            </div>

            <Button type="submit" variant="default" size="lg" className="w-full">
              Place Order
            </Button>
          </form>
        </div>
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Checkout;
