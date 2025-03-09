import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, BarChart2, Percent } from "lucide-react";

type InsightStats = {
  temps_lecture_original: string;
  temps_lecture_resume: string;
  taux_compression: string;
  nb_mots_original: number;
  nb_mots_resume: number;
  nb_phrases_cles: number;
  nb_stats_chiffres: number;
};

type InsightStatsProps = {
  stats: InsightStats;
};

export function InsightStats({ stats }: InsightStatsProps) {
  // Convertir le taux de compression en nombre pour l'animation
  const compressionRate = parseInt(stats.taux_compression);
  const timeGained =
    parseInt(stats.temps_lecture_original) -
    parseInt(stats.temps_lecture_resume);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="pt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
              <Clock className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Temps gagné</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {timeGained} min
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.temps_lecture_resume} vs {stats.temps_lecture_original}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="pt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Mots économisés
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.nb_mots_original - stats.nb_mots_resume}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.nb_mots_resume} vs {stats.nb_mots_original}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="pt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Percent className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Compression</p>
              <div className="relative pt-1">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.taux_compression}
                </p>
                <div className="overflow-hidden h-1 text-xs flex rounded bg-purple-200 mt-1">
                  <div
                    style={{ width: `${compressionRate}%` }}
                    className="transition-all duration-1000 ease-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="pt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <BarChart2 className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Points extraits
              </p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.nb_phrases_cles + stats.nb_stats_chiffres}
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.nb_phrases_cles} points • {stats.nb_stats_chiffres} stats
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
