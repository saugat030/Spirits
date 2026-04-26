import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "../types/api.types";

export type CartItem = {
  product: Product;
  selectedVariantId: string;
  quantity: number;
};

type CartState = {
  cartItems: CartItem[];
  getItemQuantity: (variantId: string) => number;
  increaseCartQuantity: (product: Product, variantId: string) => void;
  decreaseCartQuantity: (variantId: string) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      getItemQuantity: (variantId: string) => {
        return (
          get().cartItems.find((item) => item.selectedVariantId === variantId)
            ?.quantity || 0
        );
      },
      increaseCartQuantity: (product: Product, variantId: string) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) =>
              item.product.id === product.id &&
              item.selectedVariantId === variantId
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.selectedVariantId === variantId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cartItems: [
                ...state.cartItems,
                { product, selectedVariantId: variantId, quantity: 1 },
              ],
            };
          }
        });
      },
      decreaseCartQuantity: (variantId: string) => {
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.selectedVariantId === variantId
          );
          if (!existingItem) return state;

          if (existingItem.quantity === 1) {
            return {
              cartItems: state.cartItems.filter(
                (item) => item.selectedVariantId !== variantId
              ),
            };
          } else {
            return {
              cartItems: state.cartItems.map((item) =>
                item.selectedVariantId === variantId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          }
        });
      },
      removeFromCart: (variantId: string) => {
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.selectedVariantId !== variantId
          ),
        }));
      },
      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    {
      name: "shopping-cart",
    }
  )
);
