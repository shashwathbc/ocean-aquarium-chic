"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type ProductFormProps = {
    initialData?: {
        _id?: string;
        name: string;
        price: number;
        category: string;
        brand?: string;
        description: string;
        image: string;
        images?: string[];
        inStock: boolean;
        stockCount?: number;
    };
    isEditMode?: boolean;
};

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        price: initialData?.price || 0,
        category: initialData?.category || "",
        brand: initialData?.brand || "",
        description: initialData?.description || "",
        image: initialData?.image || "",
        inStock: initialData?.inStock ?? true,
        stockCount: initialData?.stockCount ?? 0,
    });

    const [existingImages, setExistingImages] = useState<string[]>(
        initialData?.images?.length ? initialData.images : (initialData?.image ? [initialData.image] : [])
    );
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    const [brands, setBrands] = useState<{ _id: string; name: string; isActive: boolean }[]>([]);
    const [isLoadingBrands, setIsLoadingBrands] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories");
                const json = await res.json();
                if (json.success) {
                    setCategories(json.data);
                }
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setIsLoadingCategories(false);
            }
        }
        async function fetchBrands() {
            try {
                const res = await fetch("/api/brands");
                const json = await res.json();
                if (json.success) {
                    // Filter out inactive brands from selection options
                    setBrands(json.data.filter((b: any) => b.isActive));
                }
            } catch (err) {
                console.error("Failed to fetch brands", err);
            } finally {
                setIsLoadingBrands(false);
            }
        }
        fetchCategories();
        fetchBrands();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || []);
        if (selected.length > 0) {
            setFiles(prev => [...prev, ...selected]);
            const newUrls = selected.map(f => URL.createObjectURL(f));
            setPreviewUrls(prev => [...prev, ...newUrls]);
        }
    };

    const removeExisting = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNew = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked :
                type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let finalImageUrls = [...existingImages];

            // If new files selected, upload them linearly
            if (files.length > 0) {
                for (let f of files) {
                    const uploadData = new FormData();
                    uploadData.append("file", f);

                    const uploadRes = await fetch("/api/upload", {
                        method: "POST",
                        body: uploadData,
                    });

                    const uploadJson = await uploadRes.json();
                    if (!uploadRes.ok) throw new Error(uploadJson.error || `Failed to upload ${f.name}`);
                    finalImageUrls.push(uploadJson.url);
                }
            }

            // Now save the product
            const payload = {
                ...formData,
                image: finalImageUrls[0] || "",
                images: finalImageUrls,
                brand: formData.brand || undefined
            };

            const endpoint = isEditMode ? `/api/products/${initialData?._id}` : "/api/products";
            const method = isEditMode ? "PUT" : "POST";

            const productRes = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const productJson = await productRes.json();
            if (!productRes.ok) throw new Error(productJson.error || "Failed to save product");

            // Success, navigate back to products list
            router.push("/admin/products");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Product Name"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Price ($)</label>
                    <input
                        type="number"
                        name="price"
                        required
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={isLoadingCategories}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">{isLoadingCategories ? "Loading categories..." : "Select Category"}</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                    <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        disabled={isLoadingBrands}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">{isLoadingBrands ? "Loading brands..." : "Select Brand (Optional)"}</option>
                        {brands.map((b) => (
                            <option key={b._id} value={b.name}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2 flex items-center pt-8">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={formData.inStock}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock</span>
                    </label>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stock Count</label>
                    <input
                        type="number"
                        name="stockCount"
                        min="0"
                        value={formData.stockCount}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Product Description"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Media</label>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {/* Existing Images */}
                    {existingImages.map((url, idx) => {
                        const isVideo = url.match(/\.(mp4|webm)$/i);
                        return (
                            <div key={`existing-${idx}`} className="relative aspect-square border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden group bg-muted">
                                {isVideo ? (
                                    <video src={url} className="w-full h-full object-cover" muted playsInline />
                                ) : (
                                    <Image src={url} alt={`Media ${idx}`} fill className="object-cover" />
                                )}
                                <button type="button" onClick={() => removeExisting(idx)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        );
                    })}

                    {/* New Files */}
                    {previewUrls.map((url, idx) => {
                        const isVideo = files[idx]?.type.startsWith("video/");
                        return (
                            <div key={`new-${idx}`} className="relative aspect-square border-2 border-teal-500 rounded-lg overflow-hidden group bg-muted">
                                {isVideo ? (
                                    <video src={url} className="w-full h-full object-cover" muted playsInline />
                                ) : (
                                    <Image src={url} alt={`Preview ${idx}`} fill className="object-cover" />
                                )}
                                <button type="button" onClick={() => removeNew(idx)} className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                                <span className="absolute bottom-2 left-2 bg-teal-600 text-[10px] px-2 py-0.5 rounded text-white font-bold uppercase tracking-wider z-10">New</span>
                            </div>
                        );
                    })}
                </div>

                {/* Upload Trigger Area */}
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-teal-600 dark:text-teal-400 hover:text-teal-500 focus-within:outline-none px-1">
                                <span>Upload media files</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    className="sr-only"
                                    multiple
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, MP4 up to 10MB</p>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 transition disabled:opacity-70"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        isEditMode ? "Save Changes" : "Create Product"
                    )}
                </button>
            </div>
        </form>
    );
}

