import { createContext, useContext, useState, ReactNode } from "react";
import { products } from "@/components/FeaturedProducts";

export type Product = typeof products[0];

export interface CartItem {
    product: Product;
    qty: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, qty?: number) => void;
    updateQty: (id: string, delta: number) => void;
    remove: (id: string) => void;
    itemCount: number;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product, qty: number = 1) => {
        setCart((prev) => {
            const existing = prev.find((p) => p.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, qty: Math.min(10, item.qty + qty) } // Validation: max 10
                        : item
                );
            }
            return [...prev, { product, qty: Math.min(10, qty) }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.product.id === id) {
                    const newQty = item.qty + delta;
                    if (newQty < 1) return item; // Handled by remove explicitly if needed, or we allow remove on 0
                    return { ...item, qty: Math.min(10, newQty) }; // Validation: max 10
                }
                return item;
            })
        );
    };

    const remove = (id: string) => setCart((prev) => prev.filter((item) => item.product.id !== id));

    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, updateQty, remove, itemCount, total }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
