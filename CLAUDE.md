# CLAUDE.md — CRM Dashboard

## Aperçu de l'objectif du projet

Dashboard CRM sur mesure destiné à un usage interne exclusif pour un entrepreneur solo (agence d'automatisation ciblant les TPE/PME et professions libérales en France). L'outil permet le suivi commercial via import de fichiers CSV locaux. Il sert également de vitrine technique démontrant une expertise en gestion de la donnée. Aucune authentification, aucun backend pour le MVP.

---

## Aperçu de l'architecture globale

Application 100% front-end (Vite + React + TypeScript). Les données vivent en mémoire React le temps de la session via un store Zustand. Navigation par rendu conditionnel (pas de React Router).

```
App  (route unique "/")
├── ImportView         — affiché si store.rows est vide
└── DashboardLayout    — affiché si store.rows contient des données
    ├── ExecutiveView  — KPIs (Revenu Sécurisé, Pipeline Actif)
    └── FocusModeView  — Table filtrée des actions urgentes
```

Stack : Vite · React 18 · TypeScript · Tailwind CSS · Shadcn UI · Zustand · Recharts · PapaParse

---

## Style visuel

- Interface claire et minimaliste
- Inspiré des standards HubSpot / Salesforce : sobre, épuré, professionnel
- **Pas de mode sombre pour le MVP**

---

## Contraintes et Politiques

- **NE JAMAIS exposer les clés API côté client**
- Ne jamais coder : authentification, vues multi-utilisateurs, SMTP, module de facturation (hors-périmètre absolu)

---

## Dépendances

- Préférer les composants existants (Shadcn UI) plutôt que d'ajouter de nouvelles bibliothèques UI
- Toute nouvelle dépendance doit être justifiée et validée avant ajout

---

## Tests interface graphique

À la fin de chaque développement impliquant l'interface graphique, tester avec le skill `webapp-testing` (Playwright). L'interface doit être :
- Responsive
- Fonctionnelle
- Répondre au besoin développé

---

## Documentation

- Cahier des charges (PRD) : [PRD.md](./PRD.md)
- Architecture technique : [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Context7

Utiliser systématiquement Context7 (outils MCP `mcp__context7__resolve-library-id` puis `mcp__context7__query-docs`) pour :
- La génération de code impliquant une bibliothèque ou un framework
- Les étapes de configuration ou d'installation
- La documentation d'une bibliothèque ou API

**Ne pas attendre une demande explicite** — l'utilisation de Context7 est automatique dès qu'une bibliothèque est concernée.

---

## Langue et spécifications

- Toutes les spécifications doivent être rédigées **en français**, y compris les specs OpenSpec (sections Purpose et Scenarios)
- Seuls les titres de Requirements restent en anglais avec les mots-clés `SHALL`/`MUST` pour la validation OpenSpec
