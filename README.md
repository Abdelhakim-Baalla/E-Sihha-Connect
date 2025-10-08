# E-Sihha Connect 🏥

![Bannière E-Sihha Connect](assets/Images/text-logo-white.jpg)

Bienvenue dans **E-Sihha Connect**, l'API backend innovante qui alimente les Dossiers Médicaux Électroniques (EHR) pour les cliniques et cabinets modernes. Conçue avec passion et précision, cette API RESTful transforme les opérations chaotiques des cliniques en une symphonie d'efficacité. De l'authentification sécurisée des utilisateurs à la planification de rendez-vous sans conflits et aux rappels par email automatisés, E-Sihha Connect assure un flux de soins sans accroc – comme un stéthoscope bien huilé !

[![Version Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/) [![Licence : MIT](https://img.shields.io/badge/Licence-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Statut de Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://example.com) [![PRs Bienvenues](https://img.shields.io/badge/PRs-bienvenues-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Aperçu

Dans le monde rapide des soins de santé, les cliniques ont besoin d'outils fiables, sécurisés et intuitifs. E-Sihha Connect est une puissance backend qui expose une API REST pour gérer les utilisateurs, les dossiers patients et les rendez-vous. Fini les doubles réservations ou les mots de passe oubliés notre système gère tout avec une prévention automatique des conflits (réponses HTTP 409) et des notifications par email.

**Pourquoi Créatif ?** Nous n'avons pas seulement codé, nous avons créé ! Imaginez le comme un concierge de clinique numérique : accueillant les utilisateurs en toute sécurité, organisant les parcours patients et murmurant des rappels par email. 🩺💻

## Fonctionnalités

Voici ce que E-Sihha Connect offre :

- **Gestion des Utilisateurs** :

  - Inscription et connexion sécurisées avec JWT (tokens d'accès + refresh).
  - Gestion des rôles (admin, médecin, infirmier, patient, secrétaire).
  - Personnalisation du profil, suspension/réactivation de comptes (admin uniquement).
  - Réinitialisation de mot de passe par email.
- **Gestion des Patients** :

  - Création, mise à jour et consultation des dossiers patients (allergies, antécédents médicaux, contacts, assurance).
  - Recherche et filtrage des patients avec des requêtes robustes.
  - Suivi des consentements et préférences pour la conformité à la confidentialité.
- **Gestion des Rendez-vous** :

  - Création de rendez-vous avec praticien assigné.
  - Vérification automatique des disponibilités et prévention des conflits (renvoie 409 en cas de chevauchement).
  - Suivi des statuts : programmé, complété, annulé.
  - Modification, annulation ou marquage comme complété.
  - Vue des disponibilités par praticien et date.
- **Notifications** :

  - Rappels automatisés par email (24h avant les rendez-vous).
  - Traitement basé sur des files d'attente avec Redis pour la fiabilité.
  - Notifications pour les rendez-vous approchants (médecins).
- **Sécurité & Meilleures Pratiques** :

  - Validation des entrées avec Joi.
  - Gestion centralisée des erreurs et logging (Winston).
  - Pas de secrets codés en dur – utilisez .env !

## Pile Technologique

Nous avons choisi des outils éprouvés pour la performance et la simplicité :

| Catégorie                     | Outils/Technologies            | Pourquoi ?                                                                  |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------- |
| **Serveur**              | Node.js + Express.js           | Framework API RESTful rapide et scalable.                                   |
| **Base de Données**     | MongoDB + Mongoose ODM         | NoSQL flexible pour les dossiers patients et schémas.                      |
| **Authentification**     | JWT (access + refresh), bcrypt | Authentification sécurisée basée sur tokens et hachage de mots de passe. |
| **Validation**           | Joi                            | Validation robuste des entrées pour prévenir les données erronées.      |
| **Logging**              | Winston                        | Logging détaillé des requêtes et erreurs.                                |
| **Files/Emails**         | Redis + Nodemailer             | Notifications asynchrones par email sans blocage.                           |
| **Tests**                | Mocha/Chai + Supertest         | Tests unitaires et d'intégration pour la fiabilité.                       |
| **Déploiement**         | Docker Compose                 | Conteneurisé pour une configuration et portabilité faciles.               |
| **Docs & Outils**        | Swagger/OpenAPI, Postman       | Docs API interactives et collections de requêtes.                          |
| **Contrôle de Version** | Git + GitHub                   | Développement collaboratif.                                                |

## Installation & Configuration

Démarrez en quelques minutes ! Support pour développement local et Docker pour des environnements de production.

### Prérequis

- Node.js v18+ (LTS recommandé)
- MongoDB (local ou cloud comme MongoDB Atlas)
- Redis (pour les files d'attente)
- Git

### Configuration Locale

1. Clonez le repo :

   ```bash
   git clone https://github.com/Abdelhakim-Baalla/E-Sihha-Connect.git
   cd E-Sihha-Connect
   ```
2. Installez les dépendances :

   ```bash
   npm install
   ```
3. Créez le fichier `.env` (copiez de `.env.example`) :

   ```env
   MONGO_URI=mongodb://localhost:27017/esihha
   JWT_SECRET=votre_secret_jwt
   REFRESH_SECRET=votre_secret_refresh
   EMAIL_SERVICE=votre_service_smtp
   REDIS_URL=redis://localhost:6379
   PORT=3000
   ```
4. Lancez le serveur :

   ```bash
   npm start
   ```

### Configuration Docker (Recommandée pour Prod) 🐳

1. Assurez-vous que Docker & Docker Compose sont installés.
2. Construisez et lancez :

   ```bash
   docker-compose up --build
   ```

   - Services : app (Node.js), mongo (MongoDB), redis (Files).
   - Accédez à l'API à `http://localhost:3000`.

Pour une configuration détaillée, consultez `docker-compose.yml` et `Dockerfile`.

## Documentation API

Explorez nos docs interactives avec Swagger !

- Lancez l'app et visitez `/api-docs` (ex. : http://localhost:3000/api-docs).
- Construit avec Swagger/OpenAPI 3.0 pour des détails complets sur les endpoints, schémas et fonctionnalités.
- Exemple : Endpoints d'auth documentés avec JWT bearer auth.

## 🤝 Contributions

Les contributions sont bienvenues ! Forkez le repo, créez une branche (`feature/votre-fonctionnalité`), commitez avec des messages clairs, et ouvrez un PR. Suivez notre style de code : camelCase pour les variables, PascalCase pour les classes, principes DRY/SRP.

- Issues : Rapportez les bugs ou suggérez des fonctionnalités via GitHub Issues.
- Planification : Consultez notre board JIRA/Trello (lien dans le repo) pour les tâches.

## 📝 Licence

Licence MIT – Libre d'utilisation, modification et distribution.

---

*Créé  par Abdelhakim Baalla. Connectons les soins de santé, un appel API à la fois ! Si vous aimez, étoilez le repo ⭐ et partagez vos retours.*
