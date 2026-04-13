import { createContext, ReactNode, useContext } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Product } from "../types/api.types";

export type CartItem = {
  product: Product;
  quantity: number;
};

type ShoppingCartContext = {
  cartQuantity: number;
  cartItems: CartItem[];
  getItemQuantity: (id: string) => number;
  increaseCartQuantity: (product: Product) => void;
  decreaseCartQuantity: (id: string) => void;
  removeFromCart: (id: string) => void;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: {children : ReactNode}) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );

  function getItemQuantity(id: string) {
    return cartItems.find((item) => item.product.id === id)?.quantity || 0;
  }

  function increaseCartQuantity(product: Product) {
    setCartItems((currItems) => {
      if (currItems.find((item) => item.product.id === product.id) == null) {
        return [...currItems, { product, quantity: 1 }];
      } else {
        return currItems.map((item) => {
          if (item.product.id === product.id) {
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  }

  function decreaseCartQuantity(id: string) {
    setCartItems((currItems) => {
      const existingItem = currItems.find((item) => item.product.id === id);

      if (!existingItem) return currItems;

      if (existingItem.quantity === 1) {
        return currItems.filter((item) => item.product.id !== id);
      } else {
        return currItems.map((item) =>
          item.product.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  }

  function removeFromCart(id: string) {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.product.id !== id);
    });
  }

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
}

