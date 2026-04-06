# Cahier des Charges : Dashboard CRM - Agence d'Automatisation

## 1. Contexte du Projet
Création d'un dashboard de suivi commercial (CRM) sur mesure. L'outil est initialement destiné à un usage interne exclusif pour un entrepreneur solo (agence d'automatisation ciblant les TPE/PME et professions libérales en France).
L'application doit avoir un design professionnel, sobre et épuré (inspiré des standards comme Hubspot ou Salesforce) et servir de vitrine technique démontrant une expertise en gestion de la donnée.

## 2. Stack Technique (Imposée)
L'agent de codage doit impérativement utiliser les technologies suivantes :
* **Framework :** React (via Next.js ou Vite).
* **Styling & UI :** Tailwind CSS + composants Shadcn UI.
* **Parsing CSV :** PapaParse (pour le traitement local des fichiers).
* **Data Visualization :** Recharts ou Tremor.
* **Architecture :** 100% Front-end pour le MVP (la donnée vit dans le state global local, aucune base de données).

## 3. Schéma de la Donnée (Source CSV)
L'application ingère un fichier CSV ayant strictement la structure suivante :
* `Task Name` (ex: "Prénom Nom - Nom Entreprise")
* `Status` (valeurs attendues : prospect, qualifié, négociation, gagné - en cours, perdu)
* `Date Created` (Format YYYY-MM-DD)
* `Due Date` (Format YYYY-MM-DD)
* `Start Date` (Format YYYY-MM-DD)
* `Assignees` (ex: "Alexandre Dubois")
* `Priority` (low, medium, high)
* `Tags` (ex: "SaaS|B2B", "Environnement|PME")
* `Task Content` (Notes textuelles sur le besoin/rendez-vous)
* `Montant Deal` (Valeur numérique, ex: 8500)

## 4. Plan de Développement (Phasage)

### Phase 1 : MVP (Périmètre du sprint actuel)
* **Import CSV local :** Zone de Drag & Drop, lecture via PapaParse. Pas de persistance des données.
* **Alertes de base sur l'import :** Notification si des champs critiques (`Montant Deal`, `Status`) sont vides ou invalides.
* **Vue Executive :** Affichage de KPIs clés en haut de l'écran.
* **Focus Mode (To-Do List active) :** Tableau filtré remontant les actions urgentes du jour.

### Phase 2 : V1 (Itération suivante - pour information)
* Sas de validation de la donnée (correction in-app des erreurs d'import).
* Graphiques avancés (Funnel de conversion, Courbe de trésorerie prédictive).
* Générateur de brouillon d'e-mail de relance contextuel (mailto: pré-rempli).
* Persistance dans le Local Storage.

### Phase 3 : V2 (Évolution SaaS - pour information)
* Intégration backend (Supabase / Xano).
* Remplacement CSV par API/Webhooks.

### Hors-périmètre Absolu (Ne jamais coder ceci)
* Système d'authentification / Login.
* Vues managériales ou filtres de performance par employés (utilisateur unique).
* Serveur SMTP interne pour envoi d'emails.
* Module de facturation.

---

## 5. Spécifications Détaillées pour le MVP (Ce que l'IA doit coder maintenant)

### Brique A : Composant d'Import
* Créer une zone de drop propre avec Shadcn.
* Intégrer PapaParse.
* Vérifier que le fichier contient bien les colonnes définies dans le schéma.
* Stocker les données parsées dans un State React global.

### Brique B : Vue Executive (Header Metrics)
Créer des cartes de KPIs (Cards Shadcn) calculées à la volée depuis le state :
1. **Revenu Sécurisé :** Somme de `Montant Deal` où `Status` inclut le mot "gagné".
2. **Pipeline Actif :** Somme de `Montant Deal` où `Status` n'est ni "gagné" ni "perdu".

### Brique C : Composant "Focus Mode"
Créer une vue principale de type Data Table (ou liste de cartes) qui n'affiche que les lignes répondant à l'un de ces deux critères :
* **Critère 1 (Urgence) :** `Due Date` est échue ou arrive à échéance dans les 2 prochains jours par rapport à la date du jour (`new Date()`).
* **Critère 2 (Stagnation) :** `Priority` est égale à "high" ET la différence entre `Date Created` et aujourd'hui est supérieure à 15 jours.
* **UI :** Pour chaque ligne affichée, extraire proprement le nom de l'entreprise (partie après le tiret dans `Task Name`).