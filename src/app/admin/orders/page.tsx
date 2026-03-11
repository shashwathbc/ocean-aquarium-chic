"use client";

import { useEffect, useState } from "react";
import { PackageSearch, Search, Truck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
    _id: string;
}

interface Order {
    _id: string;
    customerDetails: {
        name: string;
        phone: string;
        address: string;
    };
    items: OrderItem[];
    totalAmount: number;
    couponCode?: string;
    discountAmount?: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: string;
    createdAt: string;
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (data.success) {
                setOrders(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(orderId);
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();

            if (data.success) {
                toast({ title: "Order status updated successfully" });
                setOrders(orders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus as any } : order
                ));
            } else {
                toast({ title: "Failed to update status", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error updating order", variant: "destructive" });
        } finally {
            setUpdatingStatus(null);
        }
    };

    const StatusBadge = ({ status }: { status: Order['status'] }) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
            processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
            shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500",
            delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
            cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500"
        };

        const icons = {
            pending: <Clock className="w-3 h-3 mr-1" />,
            processing: <PackageSearch className="w-3 h-3 mr-1" />,
            shipped: <Truck className="w-3 h-3 mr-1" />,
            delivered: <CheckCircle2 className="w-3 h-3 mr-1" />,
            cancelled: <XCircle className="w-3 h-3 mr-1" />
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status]}`}>
                {icons[status]}
                {status}
            </span>
        );
    };

    const filteredOrders = orders.filter(o =>
        o.customerDetails.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerDetails.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Management</h2>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, phone or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-gray-800 dark:text-gray-200"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order Details</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Items</th>
                                <th className="px-6 py-4 font-medium">Total</th>
                                <th className="px-6 py-4 font-medium text-center">Status Update</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        Fetching secure orders...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No recent orders found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1">
                                                <span className="font-mono text-xs text-gray-500 uppercase tracking-wide">#{order._id.slice(-8)}</span>
                                                <span className="text-xs text-gray-500">{format(new Date(order.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                                                <div className="mt-1"><StatusBadge status={order.status} /></div>
                                                <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">{order.paymentMethod}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1">
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">{order.customerDetails.name}</span>
                                                <span className="text-xs text-gray-500">{order.customerDetails.phone}</span>
                                                <span className="text-xs text-gray-500 line-clamp-2 max-w-[200px]" title={order.customerDetails.address}>
                                                    {order.customerDetails.address}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                {order.items.slice(0, 2).map((item) => (
                                                    <div key={item._id} className="flex items-center gap-2">
                                                        {item.image ? (
                                                            <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                                                {item.image.match(/\.(mp4|webm)$/i) ? (
                                                                    <video src={item.image} className="w-full h-full object-cover" muted playsInline />
                                                                ) : (
                                                                    <img src={item.image} className="w-full h-full object-cover" alt="item" />
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                                <span className="text-[10px] text-gray-400">N/A</span>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1 max-w-[150px]">{item.name}</span>
                                                            <span className="text-[10px] text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items.length > 2 && (
                                                    <span className="text-xs text-primary font-medium pl-10">
                                                        +{order.items.length - 2} more items
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex flex-col space-y-1">
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    ₹{order.totalAmount.toLocaleString()}
                                                </span>
                                                {order.couponCode && order.discountAmount ? (
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium inline-block w-fit">
                                                        {order.couponCode} (-₹{order.discountAmount.toLocaleString()})
                                                    </span>
                                                ) : null}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <select
                                                disabled={updatingStatus === order._id}
                                                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full min-w-[130px] p-2.5 transition-opacity disabled:opacity-50"
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
