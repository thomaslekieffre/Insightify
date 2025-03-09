import { openDB } from "idb";

const DB_NAME = "insightify";
const STORE_NAME = "insights";
const VERSION = 1;

type InsightStats = {
  temps_lecture_original: string;
  temps_lecture_resume: string;
  taux_compression: string;
  nb_mots_original: number;
  nb_mots_resume: number;
  nb_phrases_cles: number;
  nb_stats_chiffres: number;
};

type Insight = {
  id: string;
  url?: string;
  text: string;
  summary: string;
  stats?: InsightStats;
  createdAt: string;
};

const initDB = async () => {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const saveInsight = async ({
  url,
  text,
  summary,
  stats,
}: {
  url?: string;
  text: string;
  summary: string;
  stats?: InsightStats;
}) => {
  const db = await initDB();
  const insight: Insight = {
    id: crypto.randomUUID(),
    url,
    text,
    summary,
    stats,
    createdAt: new Date().toISOString(),
  };
  await db.add(STORE_NAME, insight);
  return insight;
};

export const getInsights = async (): Promise<Insight[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const deleteInsight = async (id: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const clearInsights = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};
