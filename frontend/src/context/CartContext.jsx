import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((c) => c._id === product._id);
      if (existing) {
        return prev.map((c) =>
          c._id === product._id ? { ...c, qty: c.qty + qty } : c
        );
      }
      return [...prev, { ...product, qty }];
    });
  }, []);

  const increaseQty = useCallback((id) => {
    setCart((prev) => prev.map((c) => (c._id === id ? { ...c, qty: c.qty + 1 } : c)));
  }, []);

  const decreaseQty = useCallback((id) => {
    setCart((prev) =>
      prev.map((c) => (c._id === id ? { ...c, qty: c.qty - 1 } : c)).filter((c) => c.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((c) => c._id !== id));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const total = useMemo(() => cart.reduce((sum, c) => sum + c.rate * c.qty, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((sum, c) => sum + c.qty, 0), [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
