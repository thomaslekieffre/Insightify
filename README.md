# 🔍 Insightify

Insightify est un outil qui **extrait automatiquement les insights clés** d'un texte ou d'un article web. En un clic, obtenez un résumé concis et pertinent, prêt à être utilisé ou partagé.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)

## 📑 Table des matières

- [🚀 Fonctionnalités](#-fonctionnalités)
- [⚙️ Technologies](#️-technologies)
- [🛠️ Installation](#️-installation)
- [📖 Utilisation](#-utilisation)
- [🌐 Déploiement](#-déploiement)
- [🔥 Bonus Features](#-bonus-features)

## 🚀 Fonctionnalités

- **Extraction d'insights** depuis un texte ou une URL
- **Résumé structuré** avec points clés, citations et chiffres
- **Interface moderne** avec mode sombre/clair
- **Copie rapide** des résumés générés
- **Responsive design** pour une utilisation sur tous les appareils

## ⚙️ Technologies

- **Frontend**: Next.js 15 (App Router)
- **UI**: shadcn/ui + Tailwind CSS
- **IA**: LangChain + Mistral AI
- **State**: Zustand
- **Hébergement**: Vercel

## 🛠️ Installation

1. **Cloner le repo**

```bash
git clone https://github.com/votre-username/insightify.git
cd insightify
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env.local
```

Remplir les variables suivantes:

- `MISTRAL_API_KEY` - Clé API Mistral AI

4. **Lancer le serveur de développement**

```bash
pnpm dev
```

L'app sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📖 Utilisation

1. **Coller un texte** ou **entrer une URL** dans le champ prévu
2. Cliquer sur **Analyser**
3. Le résumé s'affiche avec:
   - Points clés
   - Citations importantes
   - Chiffres & statistiques
   - Conclusion
4. Utiliser le bouton **Copier** pour partager le résumé

## 🌐 Déploiement

Le déploiement se fait automatiquement sur Vercel:

1. Fork le repo
2. Connecter le repo à Vercel
3. Configurer les variables d'environnement
4. Déployer !

## 🔥 Bonus Features

- **Mode "Tweet Ready"** - Résumé en format thread X
- **Mode Offline** - Stockage local des résumés
- **Export PDF** - Sauvegarde des insights

## 📝 License

MIT © Thomas Lekieffre
