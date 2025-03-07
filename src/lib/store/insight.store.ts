import { create } from "zustand";

type InsightState = {
  url: string;
  text: string;
  summary: string | null;
  isLoading: boolean;
  error: string | null;
  setUrl: (url: string) => void;
  setText: (text: string) => void;
  setSummary: (summary: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useInsightStore = create<InsightState>((set) => ({
  url: "",
  text: "",
  summary: null,
  isLoading: false,
  error: null,
  setUrl: (url) => set({ url }),
  setText: (text) => set({ text }),
  setSummary: (summary) => set({ summary, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set({ url: "", text: "", summary: null, error: null }),
}));
