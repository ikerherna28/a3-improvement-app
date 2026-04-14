import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.join(__dirname, "..", "assets", "company-logo.png");

const colors = {
  purple: "#8A1C8C",
  orange: "#F2620F",
  background: "#F2F2F2",
  text: "#1f2937",
  muted: "#6b7280"
};

function parseParetoData(a3) {
  if (!a3.paretoData) {
    return [];
  }

  if (Array.isArray(a3.paretoData?.topCausas)) {
    return a3.paretoData.topCausas
      .map((item) => ({
        causa: String(item.causa || "Sin causa"),
        total: Number(item.total || 0)
      }))
      .filter((item) => item.total > 0)
      .slice(0, 8);
  }

  if (Array.isArray(a3.paretoData?.items)) {
    return a3.paretoData.items
      .map((item) => ({
        causa: String(item.causa || "Sin causa"),
        total: Number(item.total || 0)
      }))
      .filter((item) => item.total > 0)
      .slice(0, 8);
  }

  return [];
}

function drawHeader(doc, a3) {
  doc.rect(0, 0, doc.page.width, 90).fill(colors.background);

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 20, { fit: [120, 50] });
  } else {
    doc.roundedRect(40, 24, 120, 42, 6).fill(colors.purple);
    doc.fillColor("white").font("Helvetica-Bold").fontSize(18).text("A3", 88, 36, { width: 30 });
  }

  doc.fillColor(colors.purple).font("Helvetica-Bold").fontSize(20).text("Reporte A3", 180, 28);
  doc.fillColor(colors.muted).font("Helvetica").fontSize(10).text(`Codigo: ${a3.codigo || "N/A"}`, 180, 56);
  doc.text(`Generado: ${new Date().toLocaleString("es-ES")}`, 340, 56);
}

function drawInfoBlock(doc, label, value, x, y, w, h) {
  doc.roundedRect(x, y, w, h, 6).fillAndStroke("#ffffff", "#d1d5db");
  doc.fillColor(colors.purple).font("Helvetica-Bold").fontSize(10).text(label, x + 10, y + 10, { width: w - 20 });
  doc.fillColor(colors.text).font("Helvetica").fontSize(10).text(value || "-", x + 10, y + 28, {
    width: w - 20,
    height: h - 36
  });
}

function drawParetoChart(doc, paretoItems, x, y, width, height) {
  doc.roundedRect(x, y, width, height, 6).fillAndStroke("#ffffff", "#d1d5db");
  doc.fillColor(colors.purple).font("Helvetica-Bold").fontSize(11).text("Grafico Pareto (causas)", x + 10, y + 10);

  if (!paretoItems.length) {
    doc.fillColor(colors.muted).font("Helvetica").fontSize(10).text("No hay datos Pareto para graficar", x + 10, y + 34);
    return;
  }

  const chartX = x + 18;
  const chartY = y + 44;
  const chartW = width - 36;
  const chartH = height - 64;

  const maxValue = Math.max(...paretoItems.map((item) => item.total), 1);
  const barGap = 8;
  const barWidth = (chartW - barGap * (paretoItems.length - 1)) / paretoItems.length;

  doc.moveTo(chartX, chartY + chartH).lineTo(chartX + chartW, chartY + chartH).strokeColor("#9ca3af").stroke();

  paretoItems.forEach((item, index) => {
    const ratio = item.total / maxValue;
    const barH = Math.max(8, chartH * ratio);
    const barX = chartX + index * (barWidth + barGap);
    const barY = chartY + chartH - barH;

    doc.rect(barX, barY, barWidth, barH).fill(colors.orange);

    doc.fillColor(colors.text).font("Helvetica").fontSize(8).text(String(item.total), barX, barY - 12, {
      width: barWidth,
      align: "center"
    });

    const label = item.causa.length > 14 ? `${item.causa.slice(0, 12)}..` : item.causa;
    doc.fillColor(colors.muted).font("Helvetica").fontSize(7).text(label, barX, chartY + chartH + 4, {
      width: barWidth,
      align: "center"
    });
  });
}

export async function generateA3PdfBuffer(a3) {
  const doc = new PDFDocument({ size: "A3", margin: 34 });
  const chunks = [];

  const paretoItems = parseParetoData(a3);

  return await new Promise((resolve, reject) => {
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    drawHeader(doc, a3);

    doc.y = 104;
    doc.fillColor(colors.text).font("Helvetica-Bold").fontSize(14).text(a3.titulo || "Sin titulo");
    doc.moveDown(0.3);
    doc.fillColor(colors.muted).font("Helvetica").fontSize(10).text(`Estado: ${a3.estado || "-"} | Prioridad: ${a3.prioridad || "-"} | Area: ${a3.area || "-"}`);

    const top = 160;
    const left = 34;
    const colW = (doc.page.width - 68 - 12) / 2;

    drawInfoBlock(doc, "Descripcion del problema", a3.descripcionProblema, left, top, colW, 116);
    drawInfoBlock(doc, "Causa raiz", a3.causaRaiz, left + colW + 12, top, colW, 116);
    drawInfoBlock(doc, "Accion correctiva", a3.accionCorrectiva, left, top + 126, colW, 116);
    drawInfoBlock(
      doc,
      "Datos de trazabilidad",
      `ID A3: ${a3.id || "-"}\nCreador: ${a3.createdBy || "-"}\nRaw principal: ${a3.rawDataId || "-"}\nRaw vinculados: ${(a3.rawDataIds || []).join(", ") || "-"}`,
      left + colW + 12,
      top + 126,
      colW,
      116
    );

    drawParetoChart(doc, paretoItems, left, top + 252, doc.page.width - 68, 220);

    doc.fillColor(colors.muted).font("Helvetica").fontSize(8).text(
      "Documento generado automaticamente por A3 Improvement App",
      34,
      doc.page.height - 40,
      { align: "center", width: doc.page.width - 68 }
    );

    doc.end();
  });
}
