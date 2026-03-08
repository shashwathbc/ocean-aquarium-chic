"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                // Redirect straight to login page when done
                router.push("/login?registered=true");
            } else {
                setError(data.error || "Failed to register account");
            }
        } catch (err: any) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5 text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground">Sign Up Disabled</h3>
            <p className="text-muted-foreground">
                New admin registrations are currently disabled. Please contact the system administrator if you need access.
            </p>
            <div className="mt-8 pt-6 border-t border-border">
                <Link href="/login" className="inline-flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                    Return to Login
                </Link>
            </div>
        </div>
    );
}
