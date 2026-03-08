import { useState, useEffect } from "react";
import { Star, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Review {
    _id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    // Form State
    const [rating, setRating] = useState(5);
    const [userName, setUserName] = useState("");
    const [comment, setComment] = useState("");

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/reviews`);
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
        if (productId) fetchReviews();
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`/api/products/${productId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, rating, comment }),
            });

            const data = await res.json();

            if (data.success) {
                toast({ title: "Review submitted successfully!" });
                setUserName("");
                setComment("");
                setRating(5);
                fetchReviews(); // Refresh the list
            } else {
                toast({ title: "Failed to submit review", description: data.error || "Please check your inputs.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error submitting review", variant: "destructive" });
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate Average Rating
    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <div className="mt-16 bg-white dark:bg-gray-800/50 rounded-3xl p-6 md:p-10 shadow-sm border border-border/50">
            <h2 className="font-display font-bold text-3xl mb-8 flex items-center gap-4">
                Customer Reviews
                {reviews.length > 0 && (
                    <span className="text-xl bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-5 h-5 fill-primary text-primary" /> {avgRating} ({reviews.length})
                    </span>
                )}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Submit Review Form */}
                <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-border/50 pb-10 lg:pb-0 lg:pr-10">
                    <h3 className="font-display font-semibold text-xl mb-6">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Rating</label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-500" : "fill-transparent text-gray-300 dark:text-gray-600"}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Your Name</label>
                            <input
                                type="text"
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Your Review</label>
                            <textarea
                                required
                                rows={4}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What did you like or dislike?"
                                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </Button>
                    </form>
                </div>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border/60">
                            <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {review.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-bold text-foreground">{review.userName}</span>
                                        </div>
                                        <div className="flex gap-0.5 ml-10">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-500" : "fill-transparent text-gray-300 dark:text-gray-600"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-foreground/80 leading-relaxed ml-10 whitespace-pre-line">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
