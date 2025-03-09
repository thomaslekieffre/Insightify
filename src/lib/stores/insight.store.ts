import { create } from "zustand";

type InsightStats = {
  temps_lecture_original: string;
  temps_lecture_resume: string;
  taux_compression: string;
  nb_mots_original: number;
  nb_mots_resume: number;
  nb_phrases_cles: number;
  nb_stats_chiffres: number;
};

type InsightStore = {
  url: string;
  text: string;
  summary: string | null;
  stats: InsightStats | null;
  isLoading: boolean;
  error: string | null;
  setUrl: (url: string) => void;
  setText: (text: string) => void;
  setSummary: (summary: string) => void;
  setStats: (stats: InsightStats) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

export const useInsightStore = create<InsightStore>((set) => ({
  url: "",
  text: "",
  summary: null,
  stats: null,
  isLoading: false,
  error: null,
  setUrl: (url) => set({ url }),
  setText: (text) => set({ text }),
  setSummary: (summary) => set({ summary }),
  setStats: (stats) => set({ stats }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({ url: "", text: "", summary: null, stats: null, error: null }),
}));
