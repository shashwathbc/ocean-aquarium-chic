import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default function NewProductPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    &larr; Back
                </Link>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add New Product</h2>
            </div>
            <ProductForm />
        </div>
    );
}
