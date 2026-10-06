export const ORDER_STATUSES = [
  "RECEIVED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Statuses that still need attention from the kitchen. */
export const PENDING_STATUSES: OrderStatus[] = ["RECEIVED", "PREPARING", "READY"];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  RECEIVED: "Received",
  PREPARING: "Preparing",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Menu sections, in the order customers see them. */
export const DEFAULT_CATEGORIES = [
  "Ramadan Special",
  "Eid Special",
  "Thali",
  "Seafood",
  "Chicken",
  "Vegetarian",
  "Snacks",
  "Sweets",
  "Desserts",
  "Soups",
  "Drinks",
];

/** Upper bound per line so a typo can't create an absurd order. */
export const MAX_QUANTITY_PER_ITEM = 50;
export const MAX_PRICE_CENTS = 1_000_000; // QAR 10,000 (prices are stored in dirhams)
