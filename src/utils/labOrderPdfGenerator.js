const PDFDocument = require("pdfkit");
const { decorateOrderWithFlags } = require("./labResultFlagger");

const toPlainText = (value) => {
  if (!value && value !== 0) return "N/A";
  if (value instanceof Date) return value.toISOString();
  return String(value);
};

const formatDate = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().replace("T", " ").replace(/\..+/, "");
};

const getFullName = (entity) => {
  if (!entity) return "";
  const nom = entity.nom || entity.lastName || "";
  const prenom = entity.prenom || entity.firstName || "";
  return `${prenom} ${nom}`.trim();
};

const writeTestsSection = (doc, order) => {
  const tests = Array.isArray(order.tests) ? order.tests : [];
  if (!tests.length) {
    doc.text("Aucun test disponible.");
    return;
  }

  tests.forEach((test, index) => {
    doc.fontSize(12).text(`${index + 1}. ${test.nom || "Test"}`);
    if (test.code) doc.fontSize(10).text(`Code: ${test.code}`);
    if (test.instructions)
      doc.fontSize(10).text(`Instructions: ${test.instructions}`);

    const valueText =
      test.resultatValeur !== undefined && test.resultatValeur !== null
        ? `${test.resultatValeur}${
            test.resultatUnite ? ` ${test.resultatUnite}` : ""
          }`
        : "N/A";
    doc.fontSize(10).text(`Résultat: ${valueText}`);

    const refMin = toPlainText(test.referenceMin);
    const refMax = toPlainText(test.referenceMax);
    if (refMin !== "N/A" || refMax !== "N/A") {
      doc.fontSize(10).text(`Référence: ${refMin} - ${refMax}`);
    }

    if (test.flag) {
      doc.fontSize(10).text(`Indicateur: ${test.flag}`);
    }

    doc.moveDown(0.5);
  });
};

const generateLabOrderPdf = (orderInput) =>
  new Promise((resolve, reject) => {
    try {
      const order = decorateOrderWithFlags(orderInput);
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", (data) => buffers.push(data));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      doc.fontSize(18).text("Rapport de laboratoire", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`Identifiant de l'ordre : ${order._id}`);
      doc.fontSize(12).text(`Statut : ${order.statut || "ordered"}`);
      doc
        .fontSize(12)
        .text(`Date de création : ${formatDate(order.createdAt)}`);
      doc.moveDown();

      doc.fontSize(14).text("Patient", { underline: true });
      doc
        .fontSize(12)
        .text(
          getFullName(order.patient) || "Informations patient indisponibles"
        );
      if (order.patient && order.patient.email) {
        doc.fontSize(10).text(`Email : ${order.patient.email}`);
      }
      doc.moveDown();

      doc.fontSize(14).text("Médecin", { underline: true });
      doc
        .fontSize(12)
        .text(
          getFullName(order.medecin) || "Informations médecin indisponibles"
        );
      doc.moveDown();

      if (order.consultation) {
        doc.fontSize(14).text("Consultation liée", { underline: true });
        doc
          .fontSize(12)
          .text(
            `Identifiant : ${order.consultation._id || order.consultation}`
          );
        doc.moveDown();
      }

      doc.fontSize(14).text("Résultats", { underline: true });
      writeTestsSection(doc, order);
      doc.moveDown();

      doc.fontSize(10).text(`Rapport généré le ${formatDate(new Date())}`);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });

module.exports = {
  generateLabOrderPdf,
};
