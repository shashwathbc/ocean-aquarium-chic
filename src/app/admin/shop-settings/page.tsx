"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Store, MapPin, Image as ImageIcon, Phone, Text, Upload, X, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const schema = yup.object({
    websiteName: yup.string().optional(),
    heroBackground: yup.string().optional(),
    address: yup.string().optional(),
    shopLocation: yup.string().optional(),
    mapLocation: yup.string().optional(),
    phone: yup.string().optional(),
}).required();

export default function ShopSettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const { register, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            websiteName: "",
            heroBackground: "",
            address: "",
            shopLocation: "",
            mapLocation: "",
            phone: ""
        }
    });

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    reset(data.data);
                    setPreviewUrl(data.data.heroBackground || null);
                }
            })
            .catch(err => console.error("Failed to fetch settings", err))
            .finally(() => setIsLoading(false));
    }, [reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const clearImage = () => {
        setFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            let mediaUrl = previewUrl || ""; // Base it off the current preview

            // Upload new file if selected
            if (file) {
                const uploadData = new FormData();
                uploadData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });

                const uploadJson = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadJson.error || "Failed to upload file");
                mediaUrl = uploadJson.url;
            } else if (previewUrl === null) {
                mediaUrl = "";
            }

            const payloadData = { ...data, heroBackground: mediaUrl };

            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadData),
            });

            const result = await res.json();
            if (result.success) {
                toast.success("Shop settings updated successfully!");
            } else {
                toast.error("Failed to update settings: " + result.error);
            }
        } catch (err) {
            toast.error("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                    <Store className="w-6 h-6 text-primary" /> Shop Configuration
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">Update your global website details, homepage hero, and location information.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Global Details Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                        <Text className="w-5 h-5 text-primary" /> General Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Website Name</label>
                            <Input {...register("websiteName")} placeholder="e.g. Aquarium World" className="bg-gray-50 dark:bg-gray-900/50" />
                            <p className="text-xs text-muted-foreground">This appears in the main navigation bar.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Contact Phone Number</label>
                            <Input {...register("phone")} placeholder="+1 (555) 000-0000" className="bg-gray-50 dark:bg-gray-900/50" />
                        </div>
                    </div>
                </div>

                {/* Hero Configuration Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" /> Homepage Hero
                    </h2>

                    <div className="space-y-4">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hero Background URL (Image or Video)</label>
                        {previewUrl ? (
                            <div className="relative w-full h-80 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center group shadow-inner">
                                {previewUrl.match(/\.(mp4|webm|ogg)$/i) || file?.type.startsWith('video/') ? (
                                    <video src={previewUrl} autoPlay loop muted playsInline className="object-cover w-full h-full" />
                                ) : (
                                    <img src={previewUrl} alt="Hero Preview" className="object-cover w-full h-full" />
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="p-3 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition shadow-xl flex items-center gap-2 text-sm font-semibold"
                                    >
                                        <X className="w-5 h-5" /> Remove Background
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="w-full h-40 border-2 border-dashed border-border rounded-xl bg-muted/30 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Upload className="w-8 h-8 mb-3 text-primary/70" />
                                <span className="text-sm font-medium">Click to upload image or video</span>
                                <span className="text-xs mt-1">PNG, JPG, MP4 up to 50MB</span>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*,video/mp4,video/webm,video/ogg"
                            className="hidden"
                        />
                        <p className="text-xs text-muted-foreground">Upload a stunning high-quality underwater image (.jpg/.png) or silent background looping video (.mp4) to replace the default Hero graphic.</p>
                    </div>
                </div>

                {/* Location Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" /> Location details
                    </h2>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Physical Address</label>
                        <Textarea {...register("address")} placeholder="123 Aquarium St, NY 10001" className="bg-gray-50 dark:bg-gray-900/50 min-h-[80px]" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Google Maps Link</label>
                        <Input {...register("mapLocation")} placeholder="https://maps.app.goo.gl/..." className="bg-gray-50 dark:bg-gray-900/50" />
                        <p className="text-xs text-muted-foreground">Paste your short Google Maps share link here (e.g. from the Share button). This will be used for 'Get Directions' buttons.</p>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSaving} size="lg" className="px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        {isSaving ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                {file ? "Uploading File..." : "Saving..."}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Configuration
                            </span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
