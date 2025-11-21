const express = require("express");
const router = express.Router();
const patientDocumentController = require("../controllers/patientDocumentController");
const { verifyToken, isDoctor } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: PatientDocuments
 *   description: Gestion des documents patients
 */

/**
 * @swagger
 * /api/v1/patients/{patientId}/documents:
 *   post:
 *     summary: Upload un document pour un patient
 *     tags: [PatientDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [image, rapport, autre]
 *     responses:
 *       201:
 *         description: Document uploadé
 *       400:
 *         description: Fichier invalide
 */
router.post("/:patientId/documents", verifyToken, isDoctor, upload.single("file"), patientDocumentController.uploadDocument);

/**
 * @swagger
 * /api/v1/patients/{patientId}/documents:
 *   get:
 *     summary: Récupérer les documents d'un patient
 *     tags: [PatientDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des documents
 */
router.get("/:patientId/documents", verifyToken, patientDocumentController.getPatientDocuments);

/**
 * @swagger
 * /api/v1/documents/{id}/download:
 *   get:
 *     summary: Télécharger un document
 *     tags: [PatientDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fichier téléchargé
 */
router.get("/documents/:id/download", verifyToken, patientDocumentController.downloadDocument);

/**
 * @swagger
 * /api/v1/documents/{id}:
 *   delete:
 *     summary: Supprimer un document
 *     tags: [PatientDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document supprimé
 */
router.delete("/documents/:id", verifyToken, isDoctor, patientDocumentController.deleteDocument);

module.exports = router;
