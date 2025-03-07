import { extract } from "@extractus/article-extractor";

export type ExtractedArticle = {
  title: string;
  content: string;
  description: string | null;
  author: string | null;
  published: string | null;
  url: string;
};

export async function extractArticle(url: string): Promise<ExtractedArticle> {
  try {
    const article = await extract(url);
    if (!article) {
      throw new Error("Impossible d'extraire le contenu de l'article");
    }

    return {
      title: article.title || "Sans titre",
      content: article.content || "",
      description: article.description || null,
      author: article.author || null,
      published: article.published || null,
      url: article.url || url,
    };
  } catch (error) {
    throw new Error(
      "Erreur lors de l'extraction de l'article: " +
        (error instanceof Error ? error.message : "Erreur inconnue")
    );
  }
}
