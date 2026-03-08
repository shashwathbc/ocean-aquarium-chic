"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loader2, Upload, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const brandSchema = yup.object({
    name: yup.string().required("Name is required").max(50, "Name must be less than 50 characters"),
    description: yup.string().max(500, "Description must be less than 500 characters"),
    isActive: yup.boolean().default(true),
});

type BrandFormData = yup.InferType<typeof brandSchema>;

interface BrandFormProps {
    initialData?: any;
    onSubmit: (data: any) => void;
    isLoading?: boolean;
    onCancel: () => void;
}

export default function BrandForm({ initialData, onSubmit, isLoading, onCancel }: BrandFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<BrandFormData>({
        resolver: yupResolver(brandSchema),
        defaultValues: {
            name: "",
            description: "",
            isActive: true,
        },
    });

    // Reset form when initialData changes (useful for edit mode)
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                description: initialData.description || "",
                isActive: initialData.isActive ?? true,
            });
            setPreviewUrl(initialData.image || null);
        } else {
            reset({
                name: "",
                description: "",
                isActive: true,
            });
            setPreviewUrl(null);
        }
        setFile(null);
    }, [initialData, reset]);

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

    const handleFormSubmit = async (data: BrandFormData) => {
        setIsUploading(true);
        try {
            let imageUrl = initialData?.image || ""; // Keep existing image if any

            // If a new file was selected, upload it
            if (file) {
                const uploadData = new FormData();
                uploadData.append("file", file);

                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadData,
                });

                const uploadJson = await uploadRes.json();
                if (!uploadRes.ok) throw new Error(uploadJson.error || "Failed to upload image");
                imageUrl = uploadJson.url;
            } else if (previewUrl === null) {
                // If user cleared the image
                imageUrl = "";
            }

            // Call the parent's onSubmit, passing the resolved image url
            onSubmit({ ...data, image: imageUrl });
        } catch (error: any) {
            console.error("Image upload failed:", error);
            alert("Failed to upload image: " + error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const isSubmitting = isLoading || isUploading;

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Brand Name <span className="text-destructive">*</span>
                    </label>
                    <input
                        {...register("name")}
                        className="w-full px-4 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                        placeholder="e.g., Aqua Design Amano"
                    />
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Brand Image <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                    </label>

                    {previewUrl ? (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center group">
                            <Image
                                src={previewUrl}
                                alt="Brand Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={clearImage}
                                    className="p-2 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition shadow-lg flex items-center gap-1 text-xs font-semibold"
                                >
                                    <X className="w-4 h-4" /> Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            className="w-full h-32 border-2 border-dashed border-border rounded-xl bg-muted/30 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-6 h-6 mb-2 text-primary/70" />
                            <span className="text-sm font-medium">Click to upload image</span>
                            <span className="text-xs mt-1">PNG, JPG up to 5MB</span>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                        Description
                    </label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        className="w-full px-4 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground resize-none"
                        placeholder="Brief description of this brand..."
                    />
                    {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="isActive"
                        {...register("isActive")}
                        className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/20 focus:ring-offset-background"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-foreground">
                        Active (visible on store)
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex justify-center items-center px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 min-w-[150px]"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {isUploading ? "Uploading..." : "Saving..."}
                        </>
                    ) : initialData ? (
                        "Update Brand"
                    ) : (
                        "Create Brand"
                    )}
                </button>
            </div>
        </form>
    );
}

