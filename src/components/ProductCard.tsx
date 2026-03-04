import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart, removeFromCart, cart } = useCart();
  const inCart = cart.some((item) => item.product.id === product.id);

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block rounded-2xl overflow-hidden bg-card card-hover"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
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
          <Button
            size="icon"
            variant="ghost"
            className={`h-9 w-9 rounded-xl transition-all duration-300 ${inCart
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
              }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (inCart) {
                removeFromCart(product.id);
              } else {
                addToCart(product, 1);
              }
            }}
          >
            {inCart ? <Trash2 className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
