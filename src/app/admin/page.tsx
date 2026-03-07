"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPage() {
    const [shopLocation, setShopLocation] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch("/api/settings");
                const data = await res.json();
                if (data.success && data.data) {
                    setShopLocation(data.data.shopLocation || "");
                }
            } catch (err) {
                console.error("Failed to load settings", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSaveLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ shopLocation }),
            });
            const data = await res.json();

            if (data.success) {
                setStatusMessage({ type: "success", text: "Shop location updated successfully!" });
                setTimeout(() => setStatusMessage({ type: "", text: "" }), 3000);
            } else {
                setStatusMessage({ type: "error", text: data.error || "Failed to update location" });
            }
        } catch (err) {
            setStatusMessage({ type: "error", text: "An unexpected error occurred" });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Products Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Manage Products</h3>
                    <p className="text-sm text-gray-500 mb-4">View, add, edit, or remove products from your catalog.</p>
                    <Link href="/admin/products" className="inline-block bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                        Go to Products &rarr;
                    </Link>
                </div>

                {/* Settings Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 md:col-span-2 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Global Settings</h3>
                    <p className="text-sm text-gray-500 mb-6">Manage global configuration for your storefront.</p>

                    <form onSubmit={handleSaveLocation} className="space-y-4 max-w-xl">
                        {statusMessage.text && (
                            <div className={`p-3 rounded-lg text-sm border ${statusMessage.type === 'success'
                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {statusMessage.text}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="shopLocation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Shop Location
                            </label>
                            <div className="flex gap-3">
                                <input
                                    id="shopLocation"
                                    type="text"
                                    disabled={isLoading}
                                    value={shopLocation}
                                    onChange={(e) => setShopLocation(e.target.value)}
                                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
                                    placeholder="e.g., 123 Ocean Drive, Miami FL (or Google Maps link)"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || isSaving}
                                    className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 disabled:opacity-70 transition flex items-center justify-center min-w-[80px]"
                                >
                                    {isSaving ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        "Save"
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                This address/link will be displayed in the header, footer, or contact sections of the public site.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

