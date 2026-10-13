import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Printer,
  Copy,
  Edit3,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  FileText,
  PieChart,
  SplitSquareVertical,
  Check,
  Compass,
  ArrowRight,
  Info,
  Maximize2
} from "lucide-react";
import { LeadershipAnalysis } from "./types/leadership";
import { sampleClaudiaAnalysis, generateClaudiaSheetDataUrl } from "./utils/sampleData";
import { CuartillaReport } from "./components/CuartillaReport";
import { LeadershipWheelChart } from "./components/LeadershipWheelChart";
import { ImageInspector } from "./components/ImageInspector";
import { EditReportModal } from "./components/EditReportModal";

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<LeadershipAnalysis>(sampleClaudiaAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"split" | "cuartilla" | "wheel">("split");
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [facilitatorNotes, setFacilitatorNotes] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with Claudia's visual sheet on mount
  useEffect(() => {
    const defaultDataUrl = generateClaudiaSheetDataUrl();
    setImageUrl(defaultDataUrl);
  }, []);

  // Support pasting image from clipboard anywhere on page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processUploadedFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setImageUrl(base64String);
      // Automatically trigger analysis on new user upload
      triggerAnalysis(base64String, file.type);
    };
    reader.readAsDataURL(file);
  };

  const triggerAnalysis = async (base64Image: string, mimeType: string = "image/jpeg") => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setIsRetrying(false);
    setRetryAttempt(0);
    setAnalysisStep("Interpretando cuadrante, ejes y trazos radiales...");

    const maxAttempts = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxAttempts && !success) {
      attempt++;
      try {
        if (attempt > 1) {
          setIsRetrying(true);
          setRetryAttempt(attempt);
          setAnalysisStep(`Reintentando conexión con el servidor (Intento ${attempt} de ${maxAttempts})...`);
        }

        const stepTimer1 = setTimeout(() => {
          if (!isRetrying) setAnalysisStep("Extrayendo porcentajes y anotaciones manuscritas...");
        }, 1200);

        const stepTimer2 = setTimeout(() => {
          if (!isRetrying) setAnalysisStep("Identificando 'Puntos Palanca' (P.P.) y 'Puntos Impacto' (P.I.)...");
        }, 2600);

        const stepTimer3 = setTimeout(() => {
          if (!isRetrying) setAnalysisStep("Estructurando acciones bajo modelo de Liderazgo Situacional (SLII)...");
        }, 4200);

      // Conexión directa a Google Gemini desde el navegador
const apiKey = "AQ.AbBRN6KjUdc5sCFDC4vUPP4dlC8EKV-Vib8jTn__3ZlIc7TaYA";

const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    contents: [
      {
        parts: [
          {
            text: "Actúa como experto en desarrollo organizacional y facilitador de liderazgo. Analiza esta Rueda Laboral de Liderazgo y genera estrictamente el reporte ejecutivo de una cuartilla basándote en los trazos, calificaciones y notas manuscritas de Puntos Palanca (P.P.) y Puntos Impacto (P.I.)."
          },
          {
            inline_data: {
              mime_type: mimeType || "image/jpeg",
              data: base64Image.includes(",") ? base64Image.split(",")[1] : base64Image
            }
          }
        ]
      }
    ]
  })
});

if (!response.ok) {
  throw new Error("Error al conectar con la API de Gemini");
}

const data = await response.json();
const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

        clearTimeout(stepTimer1);
        clearTimeout(stepTimer2);
        clearTimeout(stepTimer3);

        if (response.status === 503) {
          const errData = await response.json().catch(() => ({}));
          console.warn(`[Client] Intento ${attempt} devolvió 503 Service Unavailable:`, errData);

          if (attempt < maxAttempts) {
            setIsRetrying(true);
            setRetryAttempt(attempt + 1);
            setAnalysisStep(`Reintentando conexión con el servidor en 3 segundos (Intento ${attempt + 1} de ${maxAttempts})...`);
            // Wait 3 seconds before next retry attempt
            await new Promise((resolve) => setTimeout(resolve, 3000));
            continue;
          } else {
            throw new Error(
              errData.error ||
                "El servicio de Gemini se encuentra momentáneamente saturado (503 Service Unavailable). Por favor reintenta en unos instantes."
            );
          }
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Error en el servidor: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          setAnalysis(result.data);
          success = true;
          setIsRetrying(false);
          setRetryAttempt(0);
        } else {
          throw new Error("No se pudo obtener la estructura de análisis del reporte.");
        }
      } catch (err: any) {
        console.warn(`[Client] Error en intento ${attempt}:`, err?.message);
        const isUnavailable =
          err?.message?.includes("503") ||
          err?.message?.toLowerCase()?.includes("unavailable") ||
          err?.message?.toLowerCase()?.includes("failed to fetch");

        if (attempt < maxAttempts && isUnavailable) {
          setIsRetrying(true);
          setRetryAttempt(attempt + 1);
          setAnalysisStep(`Reintentando conexión con el servidor en 3 segundos (Intento ${attempt + 1} de ${maxAttempts})...`);
          await new Promise((resolve) => setTimeout(resolve, 3000));
        } else {
          setIsRetrying(false);
          setRetryAttempt(0);
          setErrorMessage(
            err.message ||
              "Ocurrió un error al analizar la rueda. Verifica la imagen e intenta de nuevo."
          );
          break;
        }
      }
    }

    setIsAnalyzing(false);
    setIsRetrying(false);
    setAnalysisStep("");
  };

  const handleLoadClaudiaSample = () => {
    const dataUrl = generateClaudiaSheetDataUrl();
    setImageUrl(dataUrl);
    setAnalysis(sampleClaudiaAnalysis);
    setErrorMessage(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const reportText =
      analysis.resumenEjecutivoCuartilla ||
      `REPORTE INDIVIDUAL DE RESULTADOS Y RECOMENDACIONES
RUEDA LABORAL APLICADA EN LIDERAZGO

1. ENCABEZADO
- Nombre: ${analysis.header.nombre}
- Puesto: ${analysis.header.puesto}
- Fecha de Aplicación: ${analysis.header.fechaAplicacion}
- Fecha de Seguimiento: ${analysis.header.fechaSeguimiento}

2. GRÁFICA Y PROYECCIÓN
${analysis.graficaProyeccionDescripcion}
Nota al pie: "${analysis.notaAlPieObligatoria}"

3. LECTURA BREVE
Fortalezas Prioritarias:
${analysis.lecturaBreve.fortalezas
  .map(
    (f, idx) =>
      `${idx + 1}. ${f.dimension}${f.esPuntoPalanca ? " [P.P.]" : ""}: ${f.fraseExplicativa}`
  )
  .join("\n")}

Áreas de Oportunidad Prioritarias:
${analysis.lecturaBreve.areasOportunidad
  .map(
    (o, idx) =>
      `${idx + 1}. ${o.dimension}${o.esPuntoImpacto ? " [P.I.]" : ""}: ${o.fraseExplicativa}`
  )
  .join("\n")}

4. ACCIONES RECOMENDADAS (ENFOQUE SLII)
[Propósito] | [Acción sugerida] | [Evidencia breve de aplicación]
${analysis.accionesRecomendadas.paraFortalezas
  .map((a) => `• ${a.proposito} | ${a.accionSugerida} | ${a.evidenciaBreve}`)
  .join("\n")}
${analysis.accionesRecomendadas.paraOportunidades
  .map((a) => `• ${a.proposito} | ${a.accionSugerida} | ${a.evidenciaBreve}`)
  .join("\n")}

5. SEGUIMIENTO
- Evidencia a revisar: ${analysis.seguimiento.evidenciaARevisar}
- Fecha próximo encuentro: ${analysis.seguimiento.fechaProximoEncuentro}

Nota obligatoria al pie:
"${analysis.notaAlPieObligatoria}"`;

    navigator.clipboard.writeText(reportText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="no-print bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">
                  Rueda de Liderazgo
                </span>
                <span className="bg-sky-500/10 border border-sky-400/30 text-sky-400 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  Cuartilla Ejecutiva
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Análisis visual de trazos, Puntos Palanca / Impacto y Liderazgo Situacional (SLII)
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Load Claudia Sample Button */}
            <button
              onClick={handleLoadClaudiaSample}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-md border border-slate-700 transition flex items-center gap-1.5 shadow-sm"
              title="Cargar la Rueda Laboral de Claudia (ejemplo precargado)"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Ejemplo Claudia</span>
            </button>

            {/* Upload New Wheel Image */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-md transition flex items-center gap-1.5 shadow-md shadow-sky-600/25"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir Rueda</span>
            </button>

            {/* Edit Extracted Data */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-md border border-slate-700 transition flex items-center gap-1.5"
              title="Ajustar nombres, fechas o acciones antes de imprimir"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Ajustar</span>
            </button>

            {/* Copy Report */}
            <button
              onClick={handleCopyReport}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-medium rounded-md border border-slate-700 transition flex items-center gap-1.5"
              title="Copiar texto de la cuartilla al portapapeles"
            >
              {copiedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copiar</span>
                </>
              )}
            </button>

            {/* Print 1 Page */}
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-md transition flex items-center gap-1.5 shadow-md shadow-emerald-600/25"
              title="Imprimir o guardar en PDF (1 Cuartilla exacta)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between border-t border-slate-800/80 text-xs">
          <div className="flex space-x-1 py-1.5">
            <button
              onClick={() => setActiveTab("split")}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "split"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Vista Dividida (Hoja + Cuartilla)</span>
            </button>

            <button
              onClick={() => setActiveTab("cuartilla")}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "cuartilla"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cuartilla Oficial (Hoja Carta)</span>
            </button>

            <button
              onClick={() => setActiveTab("wheel")}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "wheel"
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Radar Interactivo</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Liderazgo Situacional SLII
            </span>
            <span className="text-slate-600">•</span>
            <span>Máx. 1 Cuartilla</span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Subtle retry notification banner (instead of harsh red block) */}
        {isRetrying && (
          <div className="no-print bg-amber-950/40 border border-amber-500/50 text-amber-200 px-4 py-2.5 rounded-lg flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              <div>
                <span className="font-bold text-xs text-amber-300">
                  Reintentando conexión con el servidor...
                </span>
                <span className="text-[11px] text-amber-200/90 ml-2">
                  (Intento {retryAttempt || 2} de 3 &bull; Esperando 3 segundos por alta demanda temporal en el modelo)
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-mono hidden sm:inline">
              Flash Retry Auto
            </span>
          </div>
        )}

        {/* Error notification banner - only shown if all retries failed */}
        {!isRetrying && errorMessage && (
          <div className="no-print bg-rose-950/80 border border-rose-500 text-rose-200 px-4 py-3 rounded-lg flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs">Aviso del servicio</p>
                <p className="text-xs text-rose-300 mt-0.5">{errorMessage}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {imageUrl && (
                <button
                  onClick={() => triggerAnalysis(imageUrl)}
                  className="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-white text-[11px] font-bold rounded"
                >
                  Reintentar ahora
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="text-rose-400 hover:text-rose-200 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay / Progress when Gemini analyzes wheel */}
        {isAnalyzing && (
          <div
            className={`no-print border rounded-xl p-6 text-center shadow-2xl flex flex-col items-center justify-center animate-fade-in my-2 transition-colors ${
              isRetrying
                ? "bg-slate-900/95 border-amber-500/50"
                : "bg-slate-900/90 border-sky-500/40"
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full border-4 animate-spin mb-4 ${
                isRetrying
                  ? "border-amber-500/20 border-t-amber-400"
                  : "border-sky-500/20 border-t-sky-400"
              }`}
            />
            <h3 className="font-bold text-white text-sm">
              {isRetrying
                ? "Reintentando conexión con el servidor..."
                : "Analizando Rueda Laboral de Liderazgo"}
            </h3>
            <p
              className={`text-xs mt-1 font-mono tracking-wide ${
                isRetrying ? "text-amber-300" : "text-sky-400"
              }`}
            >
              {analysisStep || "Procesando visión multimodal con Gemini Flash..."}
            </p>
            <p className="text-[11px] text-slate-400 mt-3 max-w-md">
              {isRetrying
                ? "Se detectó alta demanda momentánea en la API (503). Reintentando de forma automática tras una pausa de 3 segundos..."
                : "Detectando trazos a mano alzada, porcentajes radiales, anotaciones de 'Puntos Palanca' (P.P.) y 'Puntos Impacto' (P.I.)."}
            </p>
          </div>
        )}

        {/* View Mode: Split Screen (Image Inspector + Cuartilla) */}
        {activeTab === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Original Wheel Sheet Inspector (5 cols) */}
            <div className="no-print lg:col-span-5 flex flex-col gap-4 sticky top-20">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-white text-xs">Hoja de Evaluación Original</h2>
                  <p className="text-[10px] text-slate-400">
                    Inspecciona la autoevaluación, notas y trazos manuscritos
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {analysis.puntosPalancaIdentificados.length > 0 && (
                    <span className="bg-amber-400/10 text-amber-300 border border-amber-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      ★ Palanca
                    </span>
                  )}
                  {analysis.puntosImpactoIdentificados.length > 0 && (
                    <span className="bg-rose-400/10 text-rose-300 border border-rose-400/30 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      ⚠ Impacto
                    </span>
                  )}
                </div>
              </div>

              {/* Interactive Zoom/Pan Image Inspector */}
              <div className="h-[520px]">
                <ImageInspector
                  imageUrl={imageUrl}
                  dimensiones={analysis.dimensiones}
                  puntosPalanca={analysis.puntosPalancaIdentificados}
                  puntosImpacto={analysis.puntosImpactoIdentificados}
                  onUploadClick={() => fileInputRef.current?.click()}
                />
              </div>

              {/* Re-analyze with optional Facilitator Notes */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-sky-400" />
                    Notas Adicionales del Facilitador (Opcional)
                  </span>
                  <span className="text-[10px] text-slate-500">Para afinar el informe</span>
                </div>
                <textarea
                  value={facilitatorNotes}
                  onChange={(e) => setFacilitatorNotes(e.target.value)}
                  placeholder="Ej. Enfatizar el estilo S2 en delegación; colaborador con alto potencial en coordinar comités..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-slate-500">
                    Arrastra otra foto o pulsa 'Subir Rueda'
                  </span>
                  <button
                    onClick={() => imageUrl && triggerAnalysis(imageUrl)}
                    disabled={isAnalyzing || !imageUrl}
                    className="px-3 py-1 bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-semibold rounded flex items-center gap-1 transition"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAnalyzing ? "animate-spin" : ""}`} />
                    Reanalizar Imagen
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Cuartilla Executive Report (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="no-print w-full max-w-[850px] mb-2 flex justify-between items-center text-xs text-slate-400 px-1">
                <span className="font-semibold text-slate-300">
                  Vista Previa de Impresión (Tamaño Carta)
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">
                  1 Cuartilla estricta
                </span>
              </div>
              <CuartillaReport
                analysis={analysis}
                onEdit={() => setIsEditModalOpen(true)}
              />
            </div>
          </div>
        )}

        {/* View Mode: Cuartilla Focused View */}
        {activeTab === "cuartilla" && (
          <div className="flex flex-col items-center justify-center">
            <div className="no-print w-full max-w-[850px] mb-3 flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-lg">
              <div>
                <h3 className="font-bold text-white text-xs">
                  Hoja Ejecutiva de Liderazgo (Cuartilla Vertical Carta)
                </h3>
                <p className="text-[11px] text-slate-400">
                  Cumple con todos los estándares de alta dirección: encabezado exacto, lectura breve y tabla SLII.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded border border-slate-700 flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  Ajustar Campos
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir 1 Página
                </button>
              </div>
            </div>

            <CuartillaReport
              analysis={analysis}
              onEdit={() => setIsEditModalOpen(true)}
            />
          </div>
        )}

        {/* View Mode: Radar / Interactive Wheel View */}
        {activeTab === "wheel" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Chart Widget (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md flex flex-col items-center">
              <div className="w-full flex items-center justify-between pb-4 mb-2 border-b border-slate-800">
                <div>
                  <h2 className="font-bold text-white text-sm">
                    Rueda Digitalizada: {analysis.header.nombre}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Puntajes radiales extraídos de los trazos manuscritos (0 a 10)
                  </p>
                </div>
                <span className="bg-sky-500/10 text-sky-400 text-xs font-mono font-bold px-2 py-0.5 rounded border border-sky-500/30">
                  {analysis.dimensiones.length} Ejes evaluados
                </span>
              </div>

              <LeadershipWheelChart
                dimensiones={analysis.dimensiones}
                size={500}
              />
            </div>

            {/* Dimensional Breakdown Table (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider border-b border-slate-800 pb-2">
                Desglose Dimensional y Puntos Clave
              </h3>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 text-xs">
                {analysis.dimensiones.map((dim, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border transition ${
                      dim.esPalanca
                        ? "bg-amber-950/20 border-amber-500/40 text-amber-200"
                        : dim.esImpacto
                        ? "bg-rose-950/20 border-rose-500/40 text-rose-200"
                        : "bg-slate-950/40 border-slate-800 text-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white">{dim.nombre}</span>
                        {dim.esPalanca && (
                          <span className="bg-amber-400 text-slate-900 text-[9px] font-black uppercase px-1 rounded flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            Palanca
                          </span>
                        )}
                        {dim.esImpacto && (
                          <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-1 rounded flex items-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Impacto
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-sky-400">
                        {dim.puntuacion}/10
                      </span>
                    </div>

                    {dim.observacionesVisuales && (
                      <p className="text-[11px] text-slate-400 mt-1 italic">
                        {dim.observacionesVisuales}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setActiveTab("cuartilla")}
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  Ver Cuartilla Imprimible
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Disclaimer */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 py-3 px-4 text-center text-slate-400 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Facilitación de Desarrollo Organizacional &bull; Diagnóstico de Rueda de Liderazgo (SLII)
          </span>
          <span className="text-slate-400 font-medium italic">
            "{analysis.notaAlPieObligatoria}"
          </span>
        </div>
      </footer>

      {/* Edit Modal */}
      <EditReportModal
        analysis={analysis}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updated) => setAnalysis(updated)}
      />
    </div>
  );
}
