import { Hammer } from "lucide-react";

export default function ComingSoon({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm text-center min-h-[400px]">
            <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
                <Hammer className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
            <p className="text-gray-500 max-w-md">
                This section of the admin dashboard is currently under construction. Check back later!
            </p>
        </div>
    );
}
