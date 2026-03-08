"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Product = {
    _id: string;
    name: string;
    price: number;
    category: string;
    brand?: string;
    image: string;
    images?: string[];
    inStock: boolean;
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/products");
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            } else {
                throw new Error(data.error);
            }
        } catch (err: any) {
            setError(err.message || "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                // Refresh list
                fetchProducts();
            } else {
                alert(data.error || "Failed to delete");
            }
        } catch (err) {
            console.error("Delete error", err);
            alert("Something went wrong while deleting");
        }
    };

    const handleStatusChange = async (id: string, newStatus: boolean) => {
        try {
            // Optimistic update
            setProducts((prev) =>
                prev.map((p) => p._id === id ? { ...p, inStock: newStatus } : p)
            );

            const res = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inStock: newStatus }),
            });
            const data = await res.json();
            if (!data.success) {
                // Revert if failed
                fetchProducts();
                alert(data.error || "Failed to update status");
            }
        } catch (err) {
            console.error("Status update error", err);
            // Revert
            fetchProducts();
            alert("Something went wrong while updating status");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Products Management</h2>
                <Link
                    href="/admin/products/new"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Product
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Category & Brand</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        Loading products...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No products found. Start by adding one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 flex items-center gap-4">
                                            <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                {((product.images && product.images.length > 0 ? product.images[0] : product.image) || "").match(/\.(mp4|webm)$/i) ? (
                                                    <video
                                                        src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || ""}
                                                        className="w-full h-full object-cover"
                                                        muted
                                                        playsInline
                                                    />
                                                ) : (
                                                    <img
                                                        src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || "/assets/placeholder.png"}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{product.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 dark:text-gray-100 font-medium">{product.category}</span>
                                                {product.brand && <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{product.brand}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-teal-600 dark:text-teal-400">${product.price.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-flex">
                                                <select
                                                    value={product.inStock ? "true" : "false"}
                                                    onChange={(e) => handleStatusChange(product._id, e.target.value === "true")}
                                                    className={`appearance-none outline-none border-none cursor-pointer pl-3 pr-6 py-1 text-xs font-bold rounded-full focus:ring-2 focus:ring-offset-1 focus:ring-offset-background focus:ring-primary/50 transition-colors ${product.inStock
                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/60"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60"
                                                        }`}
                                                >
                                                    <option value="true" className="bg-background text-foreground text-sm font-medium">In Stock</option>
                                                    <option value="false" className="bg-background text-foreground text-sm font-medium">Out of Stock</option>
                                                </select>
                                                {/* Down chevron icon overlay to indicate dropdown */}
                                                <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
                                                    <svg className={`h-3 w-3 ${product.inStock ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link
                                                    href={`/admin/products/edit/${product._id}`}
                                                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="font-medium text-red-600 dark:text-red-400 hover:underline"
                                                >
                                                    Delete
                                                </button>
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

