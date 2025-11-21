# Upload de Documents Patients avec MinIO

## Vue d'ensemble

Cette fonctionnalité permet aux médecins d'uploader des images et rapports pour les dossiers patients. Les fichiers sont stockés dans MinIO (stockage d'objets compatible S3).

## Fonctionnalités

- ✅ Upload de fichiers (PDF, JPEG, PNG)
- ✅ Validation de taille (max 20MB)
- ✅ Stockage sécurisé dans MinIO
- ✅ Téléchargement de documents
- ✅ Suppression par le médecin créateur
- ✅ Liste des documents par patient

## Configuration

### Variables d'environnement

```env
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=patient-documents
```

### Installation des dépendances

```bash
npm install minio multer uuid
```

### Démarrage avec Docker

```bash
docker-compose up -d
```

MinIO sera accessible sur :
- API: http://localhost:9000
- Console: http://localhost:9001

## Endpoints API

### 1. Upload un document

```http
POST /api/v1/patients/{patientId}/documents
Authorization: Bearer {doctorToken}
Content-Type: multipart/form-data

file: [fichier binaire]
nom: "Rapport médical"
description: "Description optionnelle"
type: "rapport" | "image" | "autre"
```

### 2. Liste des documents d'un patient

```http
GET /api/v1/patients/{patientId}/documents
Authorization: Bearer {token}
```

### 3. Télécharger un document

```http
GET /api/v1/documents/{documentId}/download
Authorization: Bearer {token}
```

### 4. Supprimer un document

```http
DELETE /api/v1/documents/{documentId}
Authorization: Bearer {doctorToken}
```

## Validation

- **Types autorisés**: PDF, JPEG, PNG
- **Taille maximale**: 20MB
- **Authentification**: Médecin uniquement pour upload/suppression

## Structure de données

```javascript
{
  "_id": "...",
  "patient": "patientId",
  "medecin": { "nom": "...", "prenom": "..." },
  "nom": "rapport.pdf",
  "description": "...",
  "type": "rapport",
  "mimeType": "application/pdf",
  "taille": 1024000,
  "objectName": "patientId/uuid-rapport.pdf",
  "createdAt": "2025-01-15T10:00:00.000Z"
}
```

## Sécurité

- Seuls les médecins authentifiés peuvent uploader
- Seul le médecin créateur peut supprimer
- Validation stricte des types MIME
- Stockage isolé par patient dans MinIO
