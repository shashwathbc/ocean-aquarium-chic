import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-background relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent -z-10" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aqua/20 rounded-full blur-3xl -z-10 animate-float opacity-50" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-coral/10 rounded-full blur-3xl -z-10 animate-float opacity-50" style={{ animationDelay: '1.5s' }} />

            {/* Back Button */}
            <div className="absolute top-8 left-8">
                <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to store
                </Link>
            </div>

            {/* Header Text */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
                <Link href="/" className="inline-block">
                    <h2 className="text-3xl font-display font-bold tracking-tight text-foreground">
                        Ocean <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-aqua">Chic</span>
                    </h2>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground font-display">
                    Welcome Admin
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Secure access to your dashboard
                </p>
            </div>

            {/* Main Form Content */}
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
                <div className="glass py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-border/50 bg-background/60">
                    {children}
                </div>
            </div>

        </div>
    );
}
