"use client";

import { useEffect, useState } from "react";
import { Search, UserCheck, TrendingUp, MapPin, Phone } from "lucide-react";
import { format } from "date-fns";

interface Customer {
    _id: string;
    name: string;
    phone: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
    createdAt: string;
}

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchCustomers = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/customers");
            const data = await res.json();
            if (data.success) {
                setCustomers(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch customers");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <UserCheck className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Registry</h2>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-800 dark:text-gray-200"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Customer Profile</th>
                                <th className="px-6 py-4 font-medium">Contact Details</th>
                                <th className="px-6 py-4 font-medium text-center">Lifetime Orders</th>
                                <th className="px-6 py-4 font-medium text-right">Total Spent (LTV)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                                        Fetching global customer data...
                                    </td>
                                </tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <UserCheck className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                        No tracking data matched that search exactly.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/80 to-teal-400 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                                                    {customer.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-900 dark:text-white text-base">
                                                        {customer.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        First seen: {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center text-gray-700 dark:text-gray-300">
                                                    <Phone className="w-3.5 h-3.5 mr-2 text-gray-400" />
                                                    <span className="font-mono text-xs">{customer.phone}</span>
                                                </div>
                                                {customer.address && (
                                                    <div className="flex items-start text-gray-500">
                                                        <MapPin className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs line-clamp-2 max-w-[220px]" title={customer.address}>
                                                            {customer.address}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-center">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm border border-blue-100 dark:border-blue-800">
                                                {customer.totalOrders}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400 flex items-center">
                                                    ₹{customer.totalSpent.toLocaleString()}
                                                </span>
                                                {customer.totalOrders > 0 && (
                                                    <span className="text-[10px] text-gray-400 flex items-center mt-0.5">
                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                        Avg. ₹{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}/order
                                                    </span>
                                                )}
                                            </div>
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
