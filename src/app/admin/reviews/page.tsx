"use client";

import { useEffect, useState } from "react";
import { Trash2, Star, Search } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

interface Review {
    _id: string;
    productId: { _id: string; name: string; image: string };
    userName: string;
    rating: number;
    comment: string;
    status: string;
    createdAt: string;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { toast } = useToast();

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/reviews");
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch reviews");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        try {
            const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast({ title: "Review deleted successfully" });
                fetchReviews();
            } else {
                toast({ title: "Failed to delete review", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error deleting review", variant: "destructive" });
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.productId && r.productId.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Customer Reviews</h2>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all text-gray-800 dark:text-gray-200"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 uppercase">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">Reviewer</th>
                                <th className="px-6 py-4 font-medium">Rating</th>
                                <th className="px-6 py-4 font-medium min-w-[300px]">Comment</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                        Loading reviews...
                                    </td>
                                </tr>
                            ) : filteredReviews.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No reviews found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredReviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            {review.productId && review.productId.image ? (
                                                <div className="w-10 h-10 relative flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    {review.productId.image.match(/\.(mp4|webm)$/i) ? (
                                                        <video src={review.productId.image} className="w-full h-full object-cover" muted playsInline />
                                                    ) : (
                                                        <img src={review.productId.image} alt="Product" className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">N/A</span>
                                                </div>
                                            )}
                                            <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[150px]" title={review.productId?.name}>
                                                {review.productId?.name || "Deleted Product"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{review.userName}</span>
                                                <span className="text-xs text-gray-500">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-500" : "fill-transparent text-gray-300 dark:text-gray-600"}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2" title={review.comment}>{review.comment}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors inline-flex"
                                                title="Delete Review"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
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
