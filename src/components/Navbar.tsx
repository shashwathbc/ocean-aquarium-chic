"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Menu, X, Sun, Moon, Fish } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useCartStore } from "@/store/useCartStore";
import { useProducts } from "@/hooks/useProducts";
import { useSettings } from "@/hooks/useSettings";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "My Orders", to: "/my-orders" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((sum: number, item: any) => sum + item.qty, 0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { data: fetchedProducts } = useProducts();
  const products = fetchedProducts || [];

  const { data: settings } = useSettings();

  const searchRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    const lowerQuery = debouncedQuery.toLowerCase();
    const results = products.filter((p: any) => p.name.toLowerCase().includes(lowerQuery) || p.category.toLowerCase().includes(lowerQuery));
    setSearchResults(results);
  }, [debouncedQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass shadow-lg" : "bg-transparent"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Fish className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="font-display font-bold text-xl md:text-2xl gradient-text">
              {settings?.websiteName || "Aquarium World"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`font-display font-bold text-lg md:text-xl tracking-wide transition-colors hover:text-primary ${pathname === link.to
                  ? "text-primary"
                  : "text-foreground/70"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            <div className="relative" ref={searchRef}>
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="h-7 w-7" />
              </Button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 p-3"
                  >
                    <input
                      type="text"
                      placeholder="Search aquariums, fishes, plants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-muted/50 text-foreground px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary mb-3 font-display"
                      autoFocus
                    />
                    <div className="max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                      {searchResults.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {searchResults.map(p => (
                            <div
                              key={p.id || p._id}
                              className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors"
                              onClick={() => { router.push(`/product/${p.id || p._id}`); setSearchOpen(false); }}
                            >
                              <img src={typeof p.image === 'object' && p.image !== null && 'src' in p.image ? (p.image as any).src : p.image as string} alt={p.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0 shadow-sm" />
                              <div className="min-w-0">
                                <p className="text-sm font-bold truncate">{p.name}</p>
                                <p className="text-xs font-medium text-primary">₹{p.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : searchQuery.length > 0 && debouncedQuery.length > 0 ? (
                        <p className="text-center text-sm font-medium text-foreground/50 py-6">No products found</p>
                      ) : (
                        <p className="text-center text-xs font-medium text-foreground/40 py-4 uppercase tracking-wider">Start typing to search</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-primary relative">
                <ShoppingCart className="h-7 w-7" />
                {cartCount > 0 && (
                  <span className="absolute max-h-5 max-w-5 px-1 min-w-4 min-h-4 aspect-square -top-1 -right-1 rounded-full bg-accent text-[9px] font-bold flex items-center justify-center text-accent-foreground">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="text-foreground/70 hover:text-primary"
            >
              {theme === "dark" ? <Sun className="h-7 w-7" /> : <Moon className="h-7 w-7" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground/70 ml-1"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-72 z-[70] bg-card shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-display font-bold text-lg gradient-text">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    href={link.to}
                    className={`font-display font-bold text-2xl py-3 border-b border-border transition-colors hover:text-primary ${pathname === link.to ? "text-primary" : "text-foreground/70"
                      }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
