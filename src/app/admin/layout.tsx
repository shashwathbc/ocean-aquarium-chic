import Link from "next/link";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 hover:text-teal-600 dark:hover:text-teal-400 rounded-md transition-colors">
                        Overview
                    </Link>
                    <Link href="/admin/products" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-teal-50 dark:hover:bg-gray-700 hover:text-teal-600 dark:hover:text-teal-400 rounded-md transition-colors">
                        Products
                    </Link>
                    <Link href="/" className="block px-4 py-2 mt-auto text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        &larr; Back to Store
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 md:hidden">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin</h1>
                    <Link href="/" className="text-sm text-teal-600 dark:text-teal-400">View Store</Link>
                </header>
                <div className="flex-1 p-6 overflow-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
