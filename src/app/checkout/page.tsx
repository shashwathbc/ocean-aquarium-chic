"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/components/ui/use-toast";

const Checkout = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { cart, clearCart, getCartTotal } = useCartStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const orderPayload = {
        customerDetails: { name, phone, address },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.qty,
          image: item.product.images?.length ? item.product.images[0] : item.product.image
        })),
        totalAmount: getCartTotal(),
        paymentMethod: "COD"
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (data.success) {
        clearCart();
        setSubmitted(true);
      } else {
        toast({ title: "Checkout Failed", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error processing checkout", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-display font-semibold text-sm mb-1.5 block">Full Name</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none transition-all" placeholder="Your name" />
            </div>
            <div>
              <label className="font-display font-semibold text-sm mb-1.5 block">Phone Number</label>
              <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none transition-all" placeholder="+91 98765 43210" />
            </div>
            <div>
              <label className="font-display font-semibold text-sm mb-1.5 block">Delivery Address</label>
              <textarea required value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none resize-none transition-all" placeholder="Full address in Bangalore" />
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

            <Button type="submit" variant="default" size="lg" className="w-full py-6 text-lg font-bold" disabled={isLoading || cart.length === 0}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Processing Order...
                </span>
              ) : (
                `Place Order (₹${getCartTotal().toLocaleString()})`
              )}
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
