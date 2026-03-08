"use client";

import { useEffect, useState } from "react";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                } else {
                    throw new Error(data.error);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load product details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    &larr; Back
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Product</h2>
            </div>

            {isLoading ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm text-center">
                    <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading product details...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            ) : product ? (
                <ProductForm initialData={product} isEditMode={true} />
            ) : null}
        </div>
    );
}

