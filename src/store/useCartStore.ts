import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

export interface Product {
    id: string; // Will map to _id from MongoDB eventually 
    _id?: string;
    name: string;
    price: number;
    image: any;
    images?: string[];
    category: string;
    inStock: boolean;
    stockCount?: number;
    description?: string;
}

export interface CartItem {
    product: Product;
    qty: number;
}

interface CartState {
    cart: CartItem[];
    addToCart: (product: Product, qty?: number) => void;
    updateQty: (id: string, delta: number) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    getCartCount: () => number;
    getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: [],
            addToCart: (product, qty = 1) => {
                const productId = product._id || product.id; // Support both DB _id and static id
                set((state) => {
                    const existing = state.cart.find(
                        (item) => (item.product._id || item.product.id) === productId
                    );

                    if (existing) {
                        return {
                            cart: state.cart.map((item) =>
                                (item.product._id || item.product.id) === productId
                                    ? { ...item, qty: qty } // Set precisely to the selected quantity
                                    : item
                            ),
                        };
                    }
                    return { cart: [...state.cart, { product: { ...product, id: productId }, qty }] };
                });
                toast.success(`${qty} ${qty === 1 ? 'item' : 'items'} added to cart!`);
            },
            updateQty: (id, delta) => {
                set((state) => ({
                    cart: state.cart.map((item) =>
                        (item.product._id || item.product.id) === id
                            ? { ...item, qty: Math.max(1, item.qty + delta) }
                            : item
                    ),
                }));
            },
            removeFromCart: (id) => {
                set((state) => ({
                    cart: state.cart.filter((item) => (item.product._id || item.product.id) !== id),
                }));
            },
            clearCart: () => set({ cart: [] }),
            getCartCount: () => {
                return get().cart.reduce((sum, item) => sum + item.qty, 0);
            },
            getCartTotal: () => {
                return get().cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
            },
        }),
        {
            name: "cart-storage", // unique name for localStorage key
        }
    )
);
