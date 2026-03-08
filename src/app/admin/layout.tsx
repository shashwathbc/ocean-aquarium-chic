"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import {
    LayoutDashboard,
    ShoppingCart,
    Users,
    Ticket,
    Layers,
    CreditCard,
    Star,
    PlusCircle,
    Image as ImageIcon,
    List,
    MessageSquare,
    UserCog,
    Shield,
    Search,
    Bell,
    Sun,
    Moon,
    LogOut,
    ExternalLink,
    Store
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    const menuItems = [
        {
            section: "Main menu", items: [
                { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
                { name: "Order Management", href: "/admin/orders", icon: ShoppingCart },
                { name: "Customers", href: "/admin/customers", icon: Users },
                { name: "Coupon Code", href: "/admin/coupons", icon: Ticket },
                { name: "Categories", href: "/admin/categories", icon: Layers },
                { name: "Transaction", href: "/admin/transactions", icon: CreditCard },
                { name: "Brand", href: "/admin/brands", icon: Star },
            ]
        },
        {
            section: "Product", items: [
                { name: "Add Products", href: "/admin/products/new", icon: PlusCircle },
                { name: "Product Media", href: "/admin/products/media", icon: ImageIcon },
                { name: "Product List", href: "/admin/products", icon: List },
                { name: "Product Reviews", href: "/admin/reviews", icon: MessageSquare },
            ]
        },
        {
            section: "Admin", items: [
                { name: "Shop Settings", href: "/admin/shop-settings", icon: Store },
                { name: "Admin role", href: "/admin/roles", icon: UserCog },
                { name: "Control Authority", href: "/admin/authority", icon: Shield },
            ]
        }
    ];

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <div className="flex h-screen bg-[#F8FAFC] dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200">
            {/* Sidebar */}
            <aside className="w-[280px] bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col flex-shrink-0 h-full overflow-hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 flex-shrink-0">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                            O
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground">OCEAN ADMIN</span>
                    </Link>
                </div>

                {/* Navigation Links (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-thin">
                    {menuItems.map((group, i) => (
                        <div key={i} className="mb-6">
                            <h3 className="px-4 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                                {group.section}
                            </h3>
                            <nav className="space-y-1">
                                {group.items.map((item) => {
                                    const active = isActive(item.href);
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${active
                                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                                : "text-muted-foreground hover:bg-accent/10 hover:text-accent"
                                                }`}
                                        >
                                            <Icon className={`w-[18px] h-[18px] ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* Bottom User Area */}
                <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer mb-2">
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-10 h-10 rounded-full bg-gray-200" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-semibold truncate text-foreground">Admin User</p>
                                <p className="text-xs text-muted-foreground truncate">admin@oceanchic.com</p>
                            </div>
                        </div>
                        <LogOut className="w-4 h-4 text-muted-foreground" />
                    </div>

                    <Link href="/" className="flex items-center justify-between w-full p-3 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition group text-foreground">
                        <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                            <span className="text-sm font-medium group-hover:text-primary">Your Shop</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0 bg-[#F8FAFC] dark:bg-gray-900/50">
                {/* Top Header */}
                <header className="h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-8 z-10 flex-shrink-0">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Search Bar */}
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search data, users, or reports"
                                className="w-[320px] pl-10 pr-4 py-2.5 bg-muted/50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder-muted-foreground transition-all focus:bg-background"
                            />
                        </div>

                        {/* Top Right Icons */}
                        <div className="flex items-center gap-3">
                            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                            </button>

                            <div className="flex items-center bg-gray-50 dark:bg-gray-800 p-1 rounded-full border border-gray-100 dark:border-gray-700">
                                <button className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm text-gray-700 dark:text-white">
                                    <Sun className="w-4 h-4" />
                                </button>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <Moon className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="ml-2 w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
                                <img src="https://i.pravatar.cc/150?u=admin" alt="Profile" className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
