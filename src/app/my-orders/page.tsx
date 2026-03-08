"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { Loader2, Search, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function MyOrders() {
    const [phone, setPhone] = useState("");
    const [orders, setOrders] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phone.trim()) return;

        setIsLoading(true);
        setError("");
        setHasSearched(false);

        try {
            const res = await fetch(`/api/my-orders?phone=${encodeURIComponent(phone)}`);
            const data = await res.json();

            if (data.success) {
                setOrders(data.data || []);
                setHasSearched(true);
            } else {
                setError(data.error || "Failed to fetch orders");
            }
        } catch (err) {
            setError("An error occurred while fetching your orders.");
        } finally {
            setIsLoading(false);
        }
    };

    const statusColors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-24 md:pt-28 pb-20">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display font-bold text-3xl md:text-4xl mb-8 flex items-center gap-3"
                    >
                        <ShoppingBag className="h-8 w-8 text-primary" /> My Orders
                    </motion.h1>

                    <div className="glass rounded-3xl p-6 md:p-8 mb-10 shadow-lg border border-border/50">
                        <h2 className="font-display font-semibold text-xl mb-4">Find Your Order History</h2>
                        <p className="text-muted-foreground mb-6">Enter the phone number you used during checkout to view your orders.</p>

                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. +91 98765 43210"
                                className="flex-1 px-4 py-3 rounded-xl border border-input bg-background font-body focus:ring-2 focus:ring-ring outline-none transition-all"
                            />
                            <Button type="submit" size="lg" className="py-6 px-8 rounded-xl font-bold" disabled={isLoading || !phone}>
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Search className="w-5 h-5 mr-2" />}
                                Search Orders
                            </Button>
                        </form>
                        {error && <p className="text-destructive mt-4 text-sm font-medium">{error}</p>}
                    </div>

                    {hasSearched && !isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            {orders.length === 0 ? (
                                <div className="text-center py-16 bg-muted/30 rounded-3xl border border-border/50">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Search className="h-8 w-8 text-muted-foreground/50" />
                                    </div>
                                    <h3 className="font-display font-bold text-xl mb-2">No orders found</h3>
                                    <p className="text-muted-foreground">We couldn't find any orders associated with {phone}.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="font-display font-bold text-2xl mb-6">Your Order History ({orders.length})</h3>
                                    {orders.map((order) => (
                                        <div key={order._id || order.id} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                                            <div className="bg-muted/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border">
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Order ID</p>
                                                    <p className="font-mono text-sm font-medium">{order._id || order.id}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Date Placed</p>
                                                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Total Amount</p>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-primary">₹{order.totalAmount.toLocaleString()}</p>
                                                        {order.couponCode && order.discountAmount && (
                                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium w-fit mt-1">
                                                                {order.couponCode} applied (-₹{order.discountAmount.toLocaleString()})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6">
                                                <h4 className="font-display font-semibold text-sm mb-4 border-b border-border/50 pb-2">Items Included</h4>
                                                <div className="space-y-4">
                                                    {order.items.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            {item.image ? (
                                                                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-muted" />
                                                            ) : (
                                                                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                                                                    <ShoppingBag className="w-6 h-6 opacity-50" />
                                                                </div>
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-foreground truncate">{item.name}</p>
                                                                <p className="text-sm text-muted-foreground mt-0.5">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</p>
                                                            </div>
                                                            <div className="font-bold whitespace-nowrap">
                                                                ₹{(item.quantity * item.price).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-semibold mb-1">Delivery Address</p>
                                                        <p className="text-sm text-foreground/80">{order.customerDetails.address}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-semibold mb-1 text-right">Payment</p>
                                                        <p className="text-sm font-medium text-right">{order.paymentMethod}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
            <FloatingButtons />
        </div>
    );
}
