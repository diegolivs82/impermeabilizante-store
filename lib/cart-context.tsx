"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("enerseal-cart");
        if (stored) {
            try {
                setItems(JSON.parse(stored));
            } catch {
                localStorage.removeItem("enerseal-cart");
            }
        }
        setLoaded(true);
    }, []);

    useEffect(() => {
        if (loaded) {
            localStorage.setItem("enerseal-cart", JSON.stringify(items));
        }
    }, [items, loaded]);

    const addItem = useCallback(
        (product: Omit<CartItem, "quantity">, quantity = 1) => {
            setItems((prev) => {
                const existing = prev.find((item) => item.id === product.id);
                if (existing) {
                    return prev.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                }
                return [...prev, { ...product, quantity }];
            });
        },
        []
    );

    const removeItem = useCallback((id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((item) => item.id !== id));
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
