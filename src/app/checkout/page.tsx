"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/components/ui/use-toast";

const Checkout = () => {
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const { cart, clearCart, getCartTotal } = useCartStore();
  const { toast } = useToast();

  // Next.js hydration safety - ensure client-side rendering shows correctly
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const originalTotal = getCartTotal();
  const discountAmount = Math.round((originalTotal * discountPercentage) / 100);
  const finalTotal = originalTotal - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.data.code);
        setDiscountPercentage(data.data.discountPercentage);
        toast({ title: "Coupon Applied", description: `You got ${data.data.discountPercentage}% off!`, variant: "default" });
      } else {
        setAppliedCoupon(null);
        setDiscountPercentage(0);
        toast({ title: "Invalid Coupon", description: data.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Validation Failed", description: "Something went wrong", variant: "destructive" });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

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
        totalAmount: finalTotal,
        couponCode: appliedCoupon || undefined,
        discountAmount: discountAmount || undefined,
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
        setOrderId(data.data._id);
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
            {orderId && (
              <div className="mb-6 bg-muted/50 py-3 px-6 rounded-2xl border border-border/50 inline-block">
                <p className="text-sm font-medium text-muted-foreground mb-1">Your Order ID</p>
                <p className="font-display font-bold text-lg text-foreground tracking-wide">{orderId}</p>
              </div>
            )}
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
          {mounted && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display font-bold text-3xl md:text-4xl mb-8"
            >
              Checkout
            </motion.h1>
          )}

          {mounted && (
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
                <p className="font-display font-semibold text-sm mb-2">Have a Coupon?</p>
                <div className="flex items-center gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={appliedCoupon !== null}
                    className="flex-1 px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none transition-all uppercase"
                    placeholder="Enter code"
                  />
                  {appliedCoupon ? (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => { setAppliedCoupon(null); setDiscountPercentage(0); setCouponCode(""); }}
                      className="py-3 px-6 h-auto"
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode}
                      className="py-3 px-6 h-auto"
                    >
                      {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="mt-3 text-sm text-green-600 font-medium">
                    {appliedCoupon} applied. You save ₹{discountAmount.toLocaleString()} ({discountPercentage}%)!
                  </div>
                )}
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

              <div className="glass rounded-2xl p-5 space-y-2">
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{originalTotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                    <span>Discount ({discountPercentage}%)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Button type="submit" variant="default" size="lg" className="w-full py-6 text-lg font-bold" disabled={isLoading || cart.length === 0}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Processing Order...
                  </span>
                ) : (
                  `Place Order (₹${finalTotal.toLocaleString()})`
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Checkout;
