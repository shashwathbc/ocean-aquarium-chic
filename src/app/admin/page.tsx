"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Filter, Search, Loader2 } from "lucide-react";
import WeeklyReportChart from "@/components/admin/dashboard/WeeklyReportChart";
import UsersBarChart from "@/components/admin/dashboard/UsersBarChart";
import { useQuery } from "@tanstack/react-query";

// Type for products fetched from the API
type Product = {
    _id: string;
    name: string;
    price: number;
    image: string;
};

export default function AdminDashboardPage() {
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // Fetch actual products for the Top Products list
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();
                if (data.success && data.data) {
                    setTopProducts(data.data.slice(0, 3)); // Just take top 3 for the widget
                }
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setIsLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    // Fetch Dashboard Metrics
    const { data: metrics, isLoading: isMetricsLoading } = useQuery({
        queryKey: ["admin", "dashboard", "metrics"],
        queryFn: async () => {
            const res = await fetch("/api/admin/dashboard");
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            return data.data;
        }
    });

    if (isMetricsLoading) {
        return <div className="flex h-96 items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6 pb-12">

            {/* Top Stat Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sales Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">Total Sales</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Lifetime volume</p>
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            ₹{metrics?.totalSales?.toLocaleString() || 0}
                        </span>
                    </div>
                </div>

                {/* Orders Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">Total Orders</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">Lifetime volume</p>
                    <div className="flex items-baseline gap-3 mb-1">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {metrics?.totalOrders?.toLocaleString() || 0}
                        </span>
                    </div>
                </div>

                {/* Pending & Canceled Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm relative">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-[15px] font-semibold text-gray-800 dark:text-gray-200">Pending & Canceled</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">Lifetime volume</p>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Pending Processing</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">{metrics?.pendingCount || 0}</span>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-gray-200 dark:bg-gray-700"></div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Canceled</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-destructive">{metrics?.cancelledCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: Report Chart + Users Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Weekly Report Area */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white">Report for this week</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-gray-50 dark:bg-gray-900 rounded-lg p-1">
                                <button className="px-4 py-1.5 text-xs font-semibold bg-white dark:bg-gray-800 text-primary rounded shadow-sm">This week</button>
                                <button className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700">Last week</button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-2">
                        <div className="border-b-2 border-primary pb-2">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">52k</p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Customers</p>
                        </div>
                        <div className="border-b-2 border-transparent pb-2 hover:border-gray-200 transition">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">3.5k</p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Total Products</p>
                        </div>
                        <div className="border-b-2 border-transparent pb-2 hover:border-gray-200 transition">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">2.5k</p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Stock Products</p>
                        </div>
                        <div className="border-b-2 border-transparent pb-2 hover:border-gray-200 transition">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0.5k</p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Out of Stock</p>
                        </div>
                        <div className="border-b-2 border-transparent pb-2 hover:border-gray-200 transition hidden lg:block absolute right-6 top-[22px]">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">250k</p>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide">Revenue</p>
                        </div>
                    </div>

                    <WeeklyReportChart />
                </div>

                {/* Right Column: Users & Sales by Country */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-semibold text-primary">Users in last 30 minutes</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">21.5K</p>
                    <p className="text-[11px] text-gray-500 mb-3">Users per minute</p>

                    <UsersBarChart />

                    <div className="mt-8 border-t border-gray-100 dark:border-gray-700 pt-6 flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Sales by Country</h3>
                            <button className="text-xs font-semibold text-gray-500 hover:text-gray-700">Sales</button>
                        </div>

                        <div className="space-y-5">
                            {/* US */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-red-100 overflow-hidden relative border border-gray-200 text-[10px] flex items-center justify-center font-bold">🇺🇸</div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">30k</p>
                                            <p className="text-[10px] text-gray-500">US</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center text-[10px] font-bold text-primary"><ArrowUpRight className="w-3 h-3 mr-0.5" /> 25.8%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                            {/* Brazil */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 overflow-hidden relative border border-gray-200 text-[10px] flex items-center justify-center font-bold">🇧🇷</div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">30k</p>
                                            <p className="text-[10px] text-gray-500">Brazil</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center text-[10px] font-bold text-destructive"><ArrowDownRight className="w-3 h-3 mr-0.5" /> 16.2%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            {/* Australia */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 overflow-hidden relative border border-gray-200 text-[10px] flex items-center justify-center font-bold">🇦🇺</div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900 dark:text-white">25k</p>
                                            <p className="text-[10px] text-gray-500">Australia</p>
                                        </div>
                                    </div>
                                    <span className="flex items-center text-[10px] font-bold text-primary"><ArrowUpRight className="w-3 h-3 mr-0.5" /> 35.8%</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-primary h-1.5 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-2 border border-primary/20 text-primary font-semibold text-xs rounded-full hover:bg-primary/5 transition">
                            View Insight
                        </button>
                    </div>
                </div>

            </div>

            {/* Bottom Row: Transactions & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Transactions Table */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white">Transaction</h3>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition glow-button">
                            <Filter className="w-4 h-4" /> Filter
                        </button>
                    </div>
                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[11px] text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">No</th>
                                    <th className="px-6 py-4 font-semibold">Id Customer</th>
                                    <th className="px-6 py-4 font-semibold">Order Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200">
                                {metrics?.recentTransactions?.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent transactions.</td>
                                    </tr>
                                ) : (
                                    metrics?.recentTransactions?.map((trx: any, index: number) => (
                                        <tr key={index} className="hover:bg-muted/50 transition">
                                            <td className="px-6 py-5 text-gray-500 font-medium">{index + 1}.</td>
                                            <td className="px-6 py-5 font-semibold text-primary">
                                                <Link href="/admin/orders">{trx.id}</Link>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 text-xs">{trx.date}</td>
                                            <td className="px-6 py-5">
                                                <span className={`flex w-fit px-2 py-0.5 rounded items-center gap-1.5 text-[10px] uppercase font-bold 
                                                    ${trx.status === 'Delivered' || trx.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                        trx.status === 'Pending' || trx.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {trx.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-right">₹{trx.amount.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white">Top Products</h3>
                        <Link href="/admin/products" className="text-xs font-semibold text-primary hover:text-primary/80">All product</Link>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-9 pr-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 dark:text-gray-300 placeholder-gray-400"
                        />
                    </div>

                    <div className="space-y-4">
                        {isLoadingProducts ? (
                            <div className="text-center py-6 text-sm text-gray-500">Loading products...</div>
                        ) : topProducts.length === 0 ? (
                            <div className="text-center py-6 text-sm text-gray-500">No products found.</div>
                        ) : (
                            topProducts.map((product) => (
                                <div key={product._id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 p-3 rounded-xl transition cursor-pointer">
                                    <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-600 relative flex-shrink-0 flex items-center justify-center p-1">
                                        {/* Use a simple img tag for the dummy data or the next/image if src is valid */}
                                        <img src={product.image || "/assets/placeholder.png"} alt={product.name} className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</h4>
                                        <p className="text-xs text-gray-500 truncate">Item: #{product._id.substring(0, 8)}</p>
                                    </div>
                                    <div className="font-bold text-gray-900 dark:text-white text-sm">
                                        ${product.price}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
