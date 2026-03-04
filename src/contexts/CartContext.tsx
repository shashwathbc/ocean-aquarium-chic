import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
}

export interface CartItem {
    product: Product;
    qty: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, qty: number) => void;
    updateQty: (id: string, delta: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, qty: number = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id ? { ...item, qty: item.qty + qty } : item
                );
            }
            return [...prev, { product, qty }];
        });
        toast.success(`${qty} ${qty === 1 ? 'item' : 'items'} added to cart!`);
    };

    const updateQty = (id: string, delta: number) => {
        setCart((prev) =>
            prev.map((item) =>
                item.product.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
            )
        );
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.product.id !== id));
    };

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartCount, cartTotal }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used within a CartProvider");
    return context;
};
