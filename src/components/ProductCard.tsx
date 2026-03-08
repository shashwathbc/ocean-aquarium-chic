"use client";

import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";

interface Product {
  id: string;
  name: string;
  price: number;
  image: any;
  images?: string[];
  category: string;
  inStock: boolean;
  stockCount?: number;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { cart, addToCart, updateQty, removeFromCart } = useCartStore();
  const cartItem = cart.find(item => item.product.id === product.id);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block rounded-2xl overflow-hidden bg-card card-hover"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={
            (product.images && product.images.length > 0)
              ? product.images[0]
              : (typeof product.image === 'object' && product.image !== null && 'src' in product.image
                ? (product.image as any).src
                : product.image as string) || "/assets/placeholder.png"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(210,50%,10%,0.3)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-4">
        <span className="text-xs font-display text-muted-foreground uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="font-display font-semibold text-sm md:text-base mt-1 text-card-foreground">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <span className="font-display font-bold text-lg text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          {cartItem ? (
            <div
              className="flex items-center gap-1 bg-primary/10 rounded-xl px-1 py-1"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-primary hover:bg-primary hover:text-white rounded-lg"
                onClick={() => {
                  if (cartItem.qty === 1) removeFromCart(product.id);
                  else updateQty(product.id, -1);
                }}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-5 text-center text-sm font-bold text-primary">{cartItem.qty}</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-primary hover:bg-primary hover:text-white rounded-lg"
                disabled={cartItem.qty >= 10}
                onClick={() => updateQty(product.id, 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-xl transition-all duration-300 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product, 1);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
