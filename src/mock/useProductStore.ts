import { create } from "zustand";
import type { Product } from "@/types/types";

type ProductState = {
  products: Product[];
  loading: boolean;
  error: string | null;

  fetchProducts: () => Promise<Product[]>;
  fetchProductById: (id: number) => Promise<Product>;
  getProductById: (id: number) => Product | undefined;
  createProduct: (payload: Product) => Promise<Product>;
  updateProduct: (id: number, patch: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;

  resetError: () => void;
};

let _nextId = 4;
const fakeProducts: Product[] = [
  {
    id: 1,
    name: "Donut",
    description: "Donut description",
    price: 100,
    image: "https://picsum.photos/id/10/400/300",
    category: "donuts",
  },
  {
    id: 2,
    name: "Cake",
    description: "Cake description",
    price: 200,
    image: "https://picsum.photos/id/10/400/300",
    category: "cakes",
  },
  {
    id: 3,
    name: "Tartlet",
    description: "Tartlet description",
    price: 300,
    image: "https://picsum.photos/id/10/400/300",
    category: "tartlets",
  },
  {
    id: 4,
    name: "Packaging",
    description: "Packaging description",
    price: 400,
    image: "https://picsum.photos/id/10/400/300",
    category: "packaging",
  },
  {
    id: 5,
    name: "Sales by agreement",
    description: "Sales by agreement description",
    price: 500,
    image: "https://picsum.photos/id/10/400/300",
    category: "sales",
  },
];

const simulateDelay = <T>(result: T, ms = 600): Promise<T> => new Promise((res) => setTimeout(() => res(result), ms));

const api = {
  //FETCH ALL
  fetchAll: () => simulateDelay<Product[]>([...fakeProducts], 500),

  //FETCH BY ID
  fetchById: (id: number) =>
    simulateDelay<Product>(
      (() => {
        const item = fakeProducts.find((d) => d.id === id);
        if (!item) throw new Error("Not found");
        return { ...item };
      })(),
      450
    ),

  //CREATE
  create: (payload: Product) =>
    simulateDelay<Product>(
      (() => {
        const newItem: Product = {
          ...payload,
          id: _nextId++,
        };
        fakeProducts.push(newItem);
        return newItem;
      })(),
      700
    ),

  //UPDATE
  update: (id: number, patch: Partial<Product>) =>
    simulateDelay<Product>(
      (() => {
        const idx = fakeProducts.findIndex((d) => d.id === id);
        if (idx === -1) throw new Error("Not found");
        fakeProducts[idx] = {
          ...fakeProducts[idx],
          ...patch,
        };
        return fakeProducts[idx];
      })(),
      600
    ),

  //DELETE
  remove: (id: number) =>
    simulateDelay<void>(
      (() => {
        const idx = fakeProducts.findIndex((d) => d.id === id);
        if (idx === -1) throw new Error("Not found");
        fakeProducts.splice(idx, 1);
      })(),
      500
    ),
};

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  resetError: () => set({ error: null }),

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await api.fetchAll();
      set({ products: data, loading: false });
      return data;
    } catch (err: any) {
      set({ error: err?.message ?? "Unknown error", loading: false });
      return [];
    }
  },

  createProduct: async (payload) => {
    set({ loading: true, error: null });
    try {
      const created = await api.create(payload);
      set((state) => ({ products: [...state.products, created], loading: false }));
      return created;
    } catch (err: any) {
      set({ error: err?.message ?? "Create failed", loading: false });
      throw err;
    }
  },

  updateProduct: async (id, patch) => {
    set({ loading: true, error: null });
    try {
      const updated = await api.update(id, patch);
      set((state) => ({
        products: state.products.map((d) => (d.id === id ? updated : d)),
        loading: false,
      }));
      return updated;
    } catch (err: any) {
      set({ error: err?.message ?? "Update failed", loading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.remove(id);
      set((state) => ({
        products: state.products.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err?.message ?? "Delete failed", loading: false });
      throw err;
    }
  },

  getProductById: (id) => {
    console.log(get().products.find((d) => d.id === id));
    return get().products.find((d) => d.id === id);
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });

    try {
      const db = await api.fetchById(id);
      // actualizar o añadir en el state local
      set((state) => {
        const exists = state.products.some((d) => d.id === id);
        return {
          products: exists ? state.products.map((d) => (d.id === id ? db : d)) : [...state.products, db],
          loading: false,
        };
      });
      return db;
    } catch (err: any) {
      set({ error: err?.message ?? "Fetch by id failed", loading: false });
      throw err;
    }
  },
}));
