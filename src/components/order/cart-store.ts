"use client";

import { useSyncExternalStore } from "react";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";

/**
 * Tiny cart store: { [foodItemId]: quantity }.
 * Persisted to localStorage purely as a convenience (survives a refresh) —
 * the server never trusts it and re-validates everything on submit.
 */
export type Cart = Record<string, number>;

const STORAGE_KEY = "appify-cart-v1";
const EMPTY: Cart = {};
const listeners = new Set<() => void>();
let cart: Cart = EMPTY;
let loaded = false;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (parsed && typeof parsed === "object") {
      cart = Object.fromEntries(
        Object.entries(parsed).filter(
          ([, q]) => Number.isInteger(q) && (q as number) > 0 && (q as number) <= MAX_QUANTITY_PER_ITEM,
        ),
      ) as Cart;
    }
  } catch {
    cart = EMPTY;
  }
}

function commit(next: Cart) {
  cart = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // Storage unavailable (private mode etc.) — cart still works in memory.
  }
  listeners.forEach((l) => l());
}

export const cartActions = {
  setQuantity(id: string, quantity: number) {
    const q = Math.max(0, Math.min(MAX_QUANTITY_PER_ITEM, Math.floor(quantity)));
    const next = { ...cart };
    if (q === 0) delete next[id];
    else next[id] = q;
    commit(next);
  },
  remove(ids: string[]) {
    const next = { ...cart };
    ids.forEach((id) => delete next[id]);
    commit(next);
  },
  clear() {
    commit({});
  },
};

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCart(): Cart {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return cart;
    },
    () => EMPTY,
  );
}
