"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, MoreVertical, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import BrandForm from "@/components/admin/BrandForm";

interface Brand {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function BrandsPage() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

    // Fetch Brands
    const { data: brands = [], isLoading } = useQuery<Brand[]>({
        queryKey: ["admin-brands"],
        queryFn: async () => {
            const res = await axios.get("/api/brands");
            return res.data.data;
        },
    });

    // Create Brand Mutation
    const createMutation = useMutation({
        mutationFn: async (newBrand: any) => {
            const res = await axios.post("/api/brands", newBrand);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
            toast.success("Brand created successfully");
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create brand");
        },
    });

    // Update Brand Mutation
    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            const res = await axios.put(`/api/brands/${id}`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
            toast.success("Brand updated successfully");
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update brand");
        },
    });

    // Delete Brand Mutation
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await axios.delete(`/api/brands/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-brands"] });
            toast.success("Brand deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to delete brand");
        },
    });

    const handleEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the brand "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBrand(null);
    };

    const handleSubmit = (data: any) => {
        if (editingBrand) {
            updateMutation.mutate({ id: editingBrand._id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleStatusToggle = (id: string, currentStatus: boolean) => {
        const brand = brands.find(b => b._id === id);
        if (brand) {
            updateMutation.mutate({
                id,
                data: { isActive: !currentStatus }
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Brands</h1>
                    <p className="text-sm text-gray-500">Manage your product brands</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm glow-button"
                    >
                        <Plus className="w-5 h-5" /> Add Brand
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">

                {/* Search / Filter Bar */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder-muted-foreground bg-background"
                        />
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-[11px] text-gray-500 font-medium uppercase tracking-wider bg-gray-50 dark:bg-gray-900/50">
                            <tr>
                                <th className="px-6 py-4">Name & Slug</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">Loading brands...</td>
                                </tr>
                            ) : brands.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No brands found. Click 'Add Brand' to create one.</td>
                                </tr>
                            ) : (
                                brands.map((brand) => (
                                    <tr key={brand._id} className="hover:bg-muted/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {brand.image ? (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border relative">
                                                        <Image src={brand.image} alt={brand.name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                                        {brand.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{brand.name}</p>
                                                    <p className="text-xs text-gray-500">/{brand.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative inline-flex">
                                                <select
                                                    value={brand.isActive ? "true" : "false"}
                                                    onChange={(e) => handleStatusToggle(brand._id, brand.isActive)}
                                                    className={`appearance-none outline-none border-none cursor-pointer pl-3 pr-6 py-1 text-xs font-bold rounded-full focus:ring-2 focus:ring-offset-1 focus:ring-offset-background focus:ring-primary/50 transition-colors ${brand.isActive
                                                        ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    <option value="true" className="bg-background text-foreground text-sm font-medium">Active</option>
                                                    <option value="false" className="bg-background text-foreground text-sm font-medium">Hidden</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center">
                                                    <svg className={`h-3 w-3 ${brand.isActive ? "text-primary" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(brand)}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand._id, brand.name)}
                                                    className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/10 rounded-lg transition"
                                                    disabled={deleteMutation.isPending}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-auto p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500">
                    <p>Showing {brands.length} brands</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition text-foreground disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1.5 border border-border rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition shadow-sm">1</button>
                        <button className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition text-foreground disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Modal Overlay + Content */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h2 className="text-xl font-bold text-foreground">
                                {editingBrand ? 'Edit Brand' : 'Create Brand'}
                            </h2>
                            <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <BrandForm
                                initialData={editingBrand}
                                onSubmit={handleSubmit}
                                isLoading={createMutation.isPending || updateMutation.isPending}
                                onCancel={closeModal}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
