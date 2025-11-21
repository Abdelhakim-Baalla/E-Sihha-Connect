# E-Sihha Connect 🏥

![Bannière E-Sihha Connect](assets/Images/text-logo-white.jpg)

Bienvenue dans **E-Sihha Connect**, l'API backend innovante qui alimente les Dossiers Médicaux Électroniques (EHR) pour les cliniques et cabinets modernes. Conçue avec passion et précision, cette API RESTful transforme les opérations chaotiques des cliniques en une symphonie d'efficacité. De l'authentification sécurisée des utilisateurs à la planification de rendez-vous sans conflits et aux rappels par email automatisés, E-Sihha Connect assure un flux de soins sans accroc – comme un stéthoscope bien huilé !

[![Version Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/) [![Licence : MIT](https://img.shields.io/badge/Licence-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Statut de Build](https://img.shields.io/badge/Build-Passing-brightgreen.svg)](https://example.com) [![PRs Bienvenues](https://img.shields.io/badge/PRs-bienvenues-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

---

## Sommaire
- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Pile Technologique](#pile-technologique)
- [Guide d'installation](#guide-dinstallation)
- [Configuration](#configuration)
- [Utilisation avec Docker](#utilisation-avec-docker)
- [Documentation API](#documentation-api)
- [Tests avec Postman](#tests-avec-postman)
- [Tests automatisés](#tests-automatisés)
- [Structure du projet](#structure-du-projet)
- [Contributions](#contributions)
- [Licence](#licence)
- [Support](#support)

---

## Aperçu

Dans le monde rapide des soins de santé, les cliniques ont besoin d'outils fiables, sécurisés et intuitifs. E-Sihha Connect est une puissance backend qui expose une API REST pour gérer les utilisateurs, les dossiers patients et les rendez-vous. Fini les doubles réservations ou les mots de passe oubliés : notre système gère tout avec une prévention automatique des conflits et des notifications par email.

**Pourquoi Créatif ?** Nous n'avons pas seulement codé, nous avons créé ! Imaginez-le comme un concierge de clinique numérique : accueillant les utilisateurs en toute sécurité, organisant les parcours patients et murmurant des rappels par email. 🩺💻

---

## Fonctionnalités

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
- **Gestion des Prescriptions** :
   - Génération d'ordonnances par les médecins avec suivi des médicaments.
   - Visualisation côté patient (toutes les ordonnances ou uniquement les actives).
   - Mise à jour du statut (draft, envoyée, dispensée, etc.) pour informer les patients en temps quasi réel.
- **Sécurité & Meilleures Pratiques** :
  - Validation des entrées avec Joi.
  - Gestion centralisée des erreurs et logging (Winston).
  - Pas de secrets codés en dur – utilisez .env !

---

## Pile Technologique

| Catégorie           | Outils/Technologies            | Pourquoi ?                                                        |
| ------------------- | ----------------------------- | ----------------------------------------------------------------- |
| **Serveur**         | Node.js + Express.js           | Framework API RESTful rapide et scalable.                         |
| **Base de Données** | MongoDB + Mongoose ODM         | NoSQL flexible pour les dossiers patients et schémas.             |
| **Authentification**| JWT (access + refresh), bcrypt | Authentification sécurisée basée sur tokens et hachage de mots de passe. |
| **Validation**      | Joi                            | Validation robuste des entrées pour prévenir les données erronées.|
| **Logging**         | Winston                        | Logging détaillé des requêtes et erreurs.                         |
| **Files/Emails**    | Redis + Nodemailer             | Notifications asynchrones par email sans blocage.                 |
| **Tests**           | Mocha/Chai + Supertest         | Tests unitaires et d'intégration pour la fiabilité.               |
| **Déploiement**     | Docker Compose                 | Conteneurisé pour une configuration et portabilité faciles.       |
| **Docs & Outils**   | Swagger/OpenAPI, Postman       | Docs API interactives et collections de requêtes.                 |
| **Contrôle Version**| Git + GitHub                   | Développement collaboratif.                                       |

---

## Guide d'installation

### Prérequis
 
- Node.js >= 16.x
- npm >= 8.x
- Docker & Docker Compose
- MongoDB
- Redis

### Installation locale

1. **Cloner le projet**

   ```bash
   git clone https://github.com/Abdelhakim-Baalla/E-Sihha-Connect
   cd E-Sihha-Connect
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```
3. **Configurer les variables d’environnement**
   - Copier `.env.example` en `.env` et renseigner les valeurs (MongoDB, Redis, SMTP...)
4. **Lancer la base MongoDB et Redis**
   - En local ou via Docker (voir section Docker)
5. **Démarrer l’application**

   ```bash
   npm start
   ```

   L’API sera disponible sur `http://localhost:3000`.

---

## Configuration

Exemple de fichier `.env` :

```env
MONGO_URI=mongodb://localhost:27017/esihha
JWT_SECRET=votre_secret_jwt
REFRESH_SECRET=votre_secret_refresh
EMAIL_SERVICE=votre_service_smtp
REDIS_URL=redis://localhost:6379
PORT=3000
```

---

## Utilisation avec Docker

1. **Lancer tous les services (API, MongoDB, Redis) :**

   ```bash
   docker-compose up --build
   ```
2. **Arrêter les services :**

   ```bash
   docker-compose down
   ```

---

## Stockage des documents patients (MinIO)

Cette fonctionnalité est utilisée lorsque les médecins uploadent des images ou des rapports (PDF, JPEG, PNG ≤ 20 Mo) pour les dossiers patients.

### 1. Variables d’environnement à ajouter

Ajoutez les variables suivantes à votre `.env` (elles correspondent aux valeurs par défaut du `docker-compose.yml`).

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=patient-documents
```

### 2. Démarrer MinIO en local

```powershell
docker compose up -d minio
```

- Console d’admin : <http://localhost:9001> (login `minioadmin` / `minioadmin`).
- API S3-compatible : <http://localhost:9000>.
- Le bucket `patient-documents` est créé automatiquement par `initBucket()` au démarrage de l’API (sinon créez-le via la console MinIO).

### 3. Démarrer l’API

```powershell
npm start
```

L’API se connecte à MinIO via `src/config/minio.js` et initialise le bucket avant de monter les routes.

### 4. Upload d’un document (user story ESC-84)

Endpoint : `POST /api/v1/patients/{patientId}/documents`

- Authentification : JWT d’un médecin (`verifyToken` + `isDoctor`).
- Corps : `multipart/form-data` avec le champ `file` (PDF/JPEG/PNG ≤ 20 Mo) et, optionnellement, `nom`, `description`, `type` (`image`, `rapport`, `autre`).
- Validation : `uploadMiddleware` filtre les types et limite la taille à 20 Mo.
- Persistance : le fichier est stocké dans MinIO (`{patientId}/{uuid}-{nom}`) et les métadonnées sont enregistrées via `PatientDocumentRepository`.

### Exemple (tests/apis.rest)

```http
POST http://localhost:3000/api/v1/patients/{{patientId}}/documents
Authorization: Bearer {{doctorToken}}
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="rapport.pdf"
Content-Type: application/pdf

< ./test-files/rapport.pdf
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="type"

rapport
------WebKitFormBoundary7MA4YWxkTrZu0gW--
```

### 5. Routines de vérification

- **Lister** : `GET /api/v1/patients/{patientId}/documents`.
- **Filtrer par type** : ajoutez `?type=image|rapport|autre` à la requête précédente pour ne récupérer qu’un type précis.
- **Télécharger** : `GET /api/v1/documents/{documentId}/download`.
- **Supprimer** : `DELETE /api/v1/documents/{documentId}` (uniquement par le médecin qui a uploadé le fichier).

Ces routes sont déjà couvertes dans `tests/apis.rest`. Pour des tests automatisés, complétez `tests/patientDocument.test.js` ou ajoutez des tests d’intégration avec Supertest.

---

## Documentation API

- Swagger disponible sur : `http://localhost:3000/api-docs`
- Construit avec Swagger/OpenAPI 3.0 pour des détails complets sur les endpoints, schémas et fonctionnalités.

---

## Tests avec Postman

1. Importer la collection Postman fournie dans le dossier `postman/`.
2. Renseigner les variables d’environnement (token, url, etc).
3. Exécuter les requêtes pour tester l’API.

> **Astuce** : Une collection Postman prête à l’emploi est disponible dans le dossier `postman/` :
>
> `postman/E-Sihha-Connect.postman_collection.json`
>
> Importez-la dans Postman, renseignez les variables `base_url` et `token`, puis lancez vos tests !

---

## Tests automatisés

Pour lancer tous les tests :

```bash
npm test
```

Pour générer un rapport de couverture :

```bash
npm run coverage
```

Le rapport s’affichera dans le terminal et sera disponible dans le dossier `coverage/`.

---

## Structure du projet

- `src/` : Code source (routes, modèles, contrôleurs)
- `tests/` : Scénarios de test
- `docker-compose.yml` : Configuration Docker
- `README.md` : Ce guide

---

## Contributions

Les contributions sont bienvenues ! Forkez le repo, créez une branche (`feature/votre-fonctionnalité`), commitez avec des messages clairs, et ouvrez un PR. Suivez notre style de code : camelCase pour les variables, PascalCase pour les classes, principes DRY/SRP.

- Issues : Rapportez les bugs ou suggérez des fonctionnalités via GitHub Issues.

---

## Licence

Licence MIT – Libre d'utilisation, modification et distribution.

---

## Support

Pour toute question, ouvrir une issue sur GitHub ou contacter l’équipe projet.

---

*Créé par Abdelhakim Baalla. Connectons les soins de santé, un appel API à la fois ! Si vous aimez, étoilez le repo ⭐ et partagez vos retours.*
