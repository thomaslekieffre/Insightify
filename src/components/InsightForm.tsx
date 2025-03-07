"use client";

import { useInsightStore } from "@/lib/store/insight.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function InsightForm() {
  const {
    url,
    text,
    summary,
    isLoading,
    error,
    setUrl,
    setText,
    setSummary,
    setLoading,
    setError,
    reset,
  } = useInsightStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !text) {
      setError("Veuillez entrer une URL ou un texte");
      return;
    }
    setLoading(true);
    try {
      // TODO: Implémenter l'appel API dans la phase 3
      setSummary("Résumé temporaire pour test");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Insightify</CardTitle>
        <CardDescription>
          Entrez une URL ou collez votre texte pour obtenir un résumé
          intelligent
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
          />
          <Textarea
            placeholder="Ou collez votre texte ici..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full min-h-[200px]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={reset}>
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyse en cours..." : "Analyser"}
            </Button>
          </div>
        </form>
      </CardContent>
      {summary && (
        <CardFooter className="flex flex-col">
          <h3 className="text-lg font-semibold mb-2">Résumé</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
        </CardFooter>
      )}
    </Card>
  );
}
