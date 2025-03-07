"use client";

import { useRef, useEffect } from "react";
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
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

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
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus sur l'input URL au chargement
  useEffect(() => {
    urlInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !text) {
      setError("Veuillez entrer une URL ou un texte");
      toast.error("Veuillez entrer une URL ou un texte");
      return;
    }

    if (url && !isValidUrl(url)) {
      setError("URL invalide");
      toast.error("URL invalide");
      return;
    }

    if (text && text.length < 50) {
      setError("Le texte doit contenir au moins 50 caractères");
      toast.error("Le texte est trop court");
      return;
    }

    setLoading(true);
    toast.promise(
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, text }),
      })
        .then(async (response) => {
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error || "Une erreur est survenue");
          setSummary(data.summary);
          return data;
        })
        .catch((err) => {
          const message =
            err instanceof Error ? err.message : "Une erreur est survenue";
          setError(message);
          throw err;
        })
        .finally(() => setLoading(false)),
      {
        loading: "Analyse en cours...",
        success: "Résumé généré avec succès !",
        error: (err) =>
          err instanceof Error ? err.message : "Une erreur est survenue",
      }
    );
  };

  const handleReset = () => {
    reset();
    urlInputRef.current?.focus();
    toast.info("Formulaire réinitialisé");
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
            ref={urlInputRef}
            type="url"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            className="w-full"
          />
          <Textarea
            placeholder="Ou collez votre texte ici..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
            className="w-full min-h-[200px]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleReset}>
              Réinitialiser
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyse en cours..." : "Analyser"}
            </Button>
          </div>
        </form>
      </CardContent>
      {summary && (
        <CardFooter className="flex flex-col w-full">
          <h3 className="text-lg font-semibold mb-4 w-full">Résumé</h3>
          <div className="prose prose-sm dark:prose-invert w-full max-w-none prose-headings:mb-3 prose-headings:mt-6 prose-h2:text-xl prose-h2:font-semibold prose-p:my-2 prose-ul:my-2 prose-li:my-0 prose-blockquote:my-2 prose-blockquote:pl-4 prose-blockquote:border-l-2 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
