import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('btf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('btf_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (menuItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) {
        toast.success(`Updated ${menuItem.name} quantity`);
        return prev.map((i) =>
          i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`Added ${menuItem.name} to cart`);
      return [
        ...prev,
        {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          imageUrl: menuItem.imageUrl,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (menuItemId, quantity) => {
    if (quantity < 1) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.menuItemId === menuItemId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (menuItemId) => {
    setItems((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('btf_cart');
  };

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalAmount, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
