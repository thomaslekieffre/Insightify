import { openDB, DBSchema } from "idb";

interface InsightDBSchema extends DBSchema {
  insights: {
    key: string;
    value: {
      id: string;
      url?: string;
      text?: string;
      summary: string;
      createdAt: number;
    };
    indexes: { "by-date": number };
  };
}

let dbPromise: Promise<any> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;

  if (!dbPromise) {
    dbPromise = openDB<InsightDBSchema>("insightify-db", 1, {
      upgrade(db) {
        const store = db.createObjectStore("insights", {
          keyPath: "id",
        });
        store.createIndex("by-date", "createdAt");
      },
    });
  }

  return dbPromise;
}

export async function saveInsight(data: {
  url?: string;
  text?: string;
  summary: string;
}) {
  const db = await getDB();
  if (!db) return null;

  const id = crypto.randomUUID();
  const insight = {
    id,
    ...data,
    createdAt: Date.now(),
  };
  await db.add("insights", insight);
  return insight;
}

export async function getInsights(limit = 10) {
  const db = await getDB();
  if (!db) return [];

  return db.getAllFromIndex("insights", "by-date");
}

export async function deleteInsight(id: string) {
  const db = await getDB();
  if (!db) return;

  await db.delete("insights", id);
}

export async function clearInsights() {
  const db = await getDB();
  if (!db) return;

  await db.clear("insights");
}
