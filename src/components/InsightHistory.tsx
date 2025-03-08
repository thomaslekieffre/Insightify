"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
import {
  getInsights,
  deleteInsight,
  clearInsights,
} from "@/lib/services/storage.service";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Insight = {
  id: string;
  url?: string;
  text?: string;
  summary: string;
  createdAt: number;
};

export function InsightHistory() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInsights = async () => {
    try {
      const data = await getInsights();
      setInsights(data.reverse()); // Plus récent en premier
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      toast.error("Impossible de charger l'historique");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteInsight(id);
      toast.success("Résumé supprimé");
      loadInsights();
    } catch (error) {
      toast.error("Impossible de supprimer le résumé");
    }
  };

  const handleClear = async () => {
    if (confirm("Êtes-vous sûr de vouloir supprimer tout l'historique ?")) {
      try {
        await clearInsights();
        toast.success("Historique supprimé");
        loadInsights();
      } catch (error) {
        toast.error("Impossible de supprimer l'historique");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-muted rounded" />
            <div className="h-6 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="relative">
              <CardHeader className="pb-2">
                <div className="h-4 w-32 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Historique</h3>
        </div>
        <Button variant="destructive" size="sm" onClick={handleClear}>
          <Trash2 className="h-4 w-4 mr-2" />
          Tout supprimer
        </Button>
      </div>
      <div className="space-y-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="relative group">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {new Date(insight.createdAt).toLocaleString()}
                {insight.url && (
                  <span className="ml-2">
                    -{" "}
                    <a
                      href={insight.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {insight.url}
                    </a>
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert">
                <ReactMarkdown>{insight.summary}</ReactMarkdown>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(insight.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
