# Yoga App – frontend

Frontend Angular de l'application **Yoga App**.  
L’interface permet notamment de :

- créer un compte et se connecter,  
- afficher la liste des sessions de yoga et le détail d’une session,  
- créer / modifier / supprimer une session (profil administrateur),  
- participer ou se désinscrire d’une session (profil utilisateur),  
- consulter la page de profil (`Account / Me`),  
- gérer les routes protégées via des guards.

Le frontend consomme l’API backend via un proxy `/api` configuré dans `proxy.conf.json`.

---

## 1. Prérequis

- Node.js LTS  
- npm  

L’installation globale d’Angular CLI n’est pas obligatoire : les scripts `npm` utilisent la version locale du projet.

---

## 2. Installation et lancement

Depuis le dossier `Testez-et-ameliorez-une-application-front-main` :

```bash
# Installation des dépendances
npm install
```

### 2.1. Démarrer le backend

Pour utiliser l’application dans des conditions proches de la production, il est recommandé de démarrer d’abord le backend sur `http://localhost:8080` (voir README du back).  
Le proxy Angular redirige ensuite automatiquement les appels `/api` vers ce backend.

### 2.2. Démarrer le frontend

```bash
npm start
```

Puis ouvrir le navigateur sur :

```text
http://localhost:4200
```

---

## 3. Tests front (Jest + Cypress)

Les tests côté front sont organisés en deux grandes catégories :

- tests unitaires / d’intégration avec **Jest**,  
- tests end‑to‑end avec **Cypress** (E2E).

### 3.1. Tests Jest (unitaires + intégration)

Lancer tous les tests une fois :

```bash
npm test
```

Mode “watch” (pratique pendant le développement) :

```bash
npm run test:watch
```

Générer la couverture Jest :

```bash
npm run test:coverage
```

ou :

```bash
npm run coverage:jest
```

Les rapports de couverture Jest se trouvent ensuite dans :

```text
coverage/jest/index.html
```

Un résumé en console (`text-summary`) est également produit.

Les seuils de couverture (≈ 80 % sur statements / branches / functions / lines) sont définis dans `jest.config.js` via `coverageThreshold`.  
Si ces seuils ne sont pas atteints, Jest renvoie une erreur.

### 3.2. Tests end‑to‑end (Cypress)

Lancer Cypress en mode interactif :

```bash
npm run e2e
```

Lancer Cypress en mode headless (par ex. en CI) :

```bash
npm run e2e:ci
```

Les scénarios couvrent les écrans principaux décrits dans le plan de tests : authentification (login / register / logout), sessions (liste, détail, création, modification, suppression, participation), compte utilisateur, et page 404.

### 3.3. E2E + couverture (NYC)

Pour exécuter les tests Cypress en mode instrumenté et générer un rapport de couverture global :

```bash
npm run cy:all:coverage
```

ou :

```bash
npm run coverage:cypress
```

Ce script :

- nettoie les dossiers `.nyc_output` et `coverage/cypress`,  
- démarre l’application instrumentée pour la couverture,  
- exécute `cypress run`,  
- produit les rapports NYC (HTML + lcov + résumé),  
- applique un seuil de 80 % sur statements / branches / functions / lines.

Rapport HTML de la couverture E2E :

```text
coverage/cypress/index.html
```

---

## 4. Organisation du code Angular

```text
src/
 └── app/
     ├── components/          # composants “purs” (ex. composant Me/Account)
     ├── core/
     │   ├── models/          # interfaces TypeScript (User, Session, Teacher…)
     │   └── service/         # services métiers + appels API
     ├── guards/              # AuthGuard / UnauthGuard
     ├── interceptors/        # intercepteur JWT
     ├── pages/               # écrans (login, register, sessions, not-found)
     └── shared/              # modules et composants partagés
```

- **Tests Jest** : `src/app/**/*.spec.ts` (services, composants, guards, interceptors…)  
- **Tests Cypress** : `cypress/e2e/*.cy.ts` (auth-feature, account-feature, sessions-feature, not-found)  

---

## 5. Résumé sur la couverture (front)

Pour répondre aux attentes du projet (auto‑évaluation P4) :

- les tests Jest visent **au moins 80 %** de couverture sur statements / branches / functions / lines,  
- les tests E2E Cypress couplés à NYC visent également **80 %** minimum sur les mêmes indicateurs.

Les commandes `npm run test:coverage` / `npm run coverage:jest` (Jest) et `npm run cy:all:coverage` / `npm run coverage:cypress` (Cypress+NYC) échouent si les seuils ne sont pas atteints, ce qui permet de contrôler la qualité globale du frontend. Les rapports sont respectivement dans `coverage/jest/` et `coverage/cypress/`. 

