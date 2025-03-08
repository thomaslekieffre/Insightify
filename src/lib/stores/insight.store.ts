import { create } from "zustand";

type InsightState = {
  text: string;
  url: string;
  summary: string;
  isLoading: boolean;
  error: string | null;
  setText: (text: string) => void;
  setUrl: (url: string) => void;
  setSummary: (summary: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

const initialState = {
  text: "",
  url: "",
  summary: "",
  isLoading: false,
  error: null,
};

export const useInsightStore = create<InsightState>((set) => ({
  ...initialState,
  setText: (text) => set({ text }),
  setUrl: (url) => set({ url }),
  setSummary: (summary) => set({ summary }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
