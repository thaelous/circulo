import React from "react";
import { LeadershipAnalysis } from "../types/leadership";
import {
  Sparkles,
  AlertTriangle,
  Compass,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  CalendarCheck,
  FileCheck2,
  TrendingUp,
} from "lucide-react";

interface CuartillaReportProps {
  analysis: LeadershipAnalysis;
  onEdit?: () => void;
}

function formatBoldText(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderMarkdownSafe(content: string) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2 text-slate-800 text-[11.5px] leading-relaxed select-text">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }
        if (trimmed.startsWith("###") || trimmed.startsWith("##") || trimmed.startsWith("#")) {
          const headingText = trimmed.replace(/^#+\s*/, "");
          return (
            <h3
              key={idx}
              className="text-[11px] font-black uppercase tracking-wider text-slate-900 pt-1.5 pb-0.5 border-b border-slate-200"
            >
              {headingText}
            </h3>
          );
        }
        if (trimmed.startsWith("-") || trimmed.startsWith("•") || trimmed.startsWith("*")) {
          const bulletText = trimmed.replace(/^[-•*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-2">
              <span className="text-sky-600 font-bold">•</span>
              <span>{formatBoldText(bulletText)}</span>
            </div>
          );
        }
        return <p key={idx}>{formatBoldText(line)}</p>;
      })}
    </div>
  );
}

export const CuartillaReport: React.FC<CuartillaReportProps> = ({ analysis }) => {
  const {
    header,
    graficaProyeccionDescripcion,
    lecturaBreve,
    accionesRecomendadas,
    seguimiento,
    notaAlPieObligatoria,
    isRawText,
    rawMarkdown,
  } = analysis;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Container simulating Letter Paper sheet (8.5 x 11 in ratio) */}
      <div
        id="cuartilla-print-area"
        className="cuartilla-sheet bg-white text-slate-800 shadow-xl border border-slate-200 w-full max-w-[850px] px-8 py-6 rounded-sm relative text-[12px] leading-relaxed select-text"
        style={{
          minHeight: "1056px",
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        {/* Top Accent Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-700 via-indigo-600 to-amber-500 rounded-t-sm print:h-1" />

        {/* 1. ENCABEZADO */}
        <header className="border-b-2 border-slate-800 pb-2.5 mb-3">
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="flex items-center gap-2 text-sky-800 text-[10.5px] font-bold tracking-widest uppercase">
                <Compass className="w-3.5 h-3.5 inline text-sky-700" />
                <span>Desarrollo Organizacional &bull; Facilitación de Liderazgo (SLII®)</span>
              </div>
              <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight mt-0.5 uppercase">
                Reporte Individual de Resultados y Recomendaciones
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Instrumento: Rueda Laboral aplicada en Liderazgo | Diagnóstico y Plan de Acción
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="inline-block bg-slate-100 text-slate-700 text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-300">
                1 Cuartilla Oficial
              </span>
            </div>
          </div>

          {/* Grid de Encabezado */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-200 bg-slate-50/80 p-2 rounded border">
            <div>
              <span className="block text-[9.5px] uppercase font-bold text-slate-400">Nombre</span>
              <span className="font-bold text-slate-900 text-[12.5px] block truncate">
                {header.nombre || "No especificado"}
              </span>
            </div>
            <div>
              <span className="block text-[9.5px] uppercase font-bold text-slate-400">Puesto (si aplica)</span>
              <span className="font-semibold text-slate-800 text-[11.5px] block truncate">
                {header.puesto || "No especificado"}
              </span>
            </div>
            <div>
              <span className="block text-[9.5px] uppercase font-bold text-slate-400">Fecha de Aplicación</span>
              <span className="font-semibold text-slate-800 text-[11.5px] block">
                {header.fechaAplicacion || "No especificada"}
              </span>
            </div>
            <div>
              <span className="block text-[9.5px] uppercase font-bold text-slate-400">Fecha de Seguimiento</span>
              <span className="font-semibold text-sky-800 text-[11.5px] block">
                {header.fechaSeguimiento || "Por definir"}
              </span>
            </div>
          </div>
        </header>

        {/* Body content: Either structured 5 sections or direct markdown / plain text */}
        {isRawText && rawMarkdown ? (
          <div className="mb-3 bg-slate-50/50 p-3.5 rounded border border-slate-200">
            {renderMarkdownSafe(rawMarkdown)}
          </div>
        ) : (
          <>
            {/* 2. GRÁFICA Y PROYECCIÓN */}
            <section className="mb-3 bg-sky-50/40 border border-sky-200/80 rounded p-2.5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[11px] font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-700 inline" />
                  Gráfica y Proyección (Autoevaluación Actual vs. Meta Acordada)
                </h2>
                <span className="text-[9.5px] text-sky-800 font-semibold bg-sky-100/70 px-1.5 py-0.2 rounded">
                  Escala 1 a 10 / %
                </span>
              </div>
              <p className="text-[11.5px] text-slate-700 leading-snug">
                {graficaProyeccionDescripcion ||
                  "Panorama de la gráfica de araña: autoevaluación actual y meta acordada al plazo establecido con base en los trazos de la hoja."}
              </p>
            </section>

            {/* 3. LECTURA BREVE (MÁXIMO 4 FRASES) */}
            <section className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-[11px] font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-800 inline" />
                  Lectura Breve (Máximo 4 Frases)
                </h2>
                <span className="text-[9.5px] text-slate-400 italic">
                  Hasta dos fortalezas (P.P.) y dos oportunidades (P.I.)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {/* Fortalezas (Hasta 2) */}
                <div className="border border-emerald-200 bg-emerald-50/30 rounded p-2.5">
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-emerald-200">
                    <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Fortalezas Prioritarias
                    </span>
                    <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                      Punto Palanca (P.P.)
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {lecturaBreve.fortalezas.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-[11px]">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-bold text-slate-900">{item.dimension}</span>
                          {item.esPuntoPalanca && (
                            <span className="bg-amber-100 text-amber-800 text-[8.5px] font-black uppercase px-1 py-0.2 rounded border border-amber-300 inline-flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                              P.P.
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 mt-0.5 text-[11px] leading-snug">
                          {item.fraseExplicativa}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Oportunidades (Hasta 2) */}
                <div className="border border-rose-200 bg-rose-50/30 rounded p-2.5">
                  <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-rose-200">
                    <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                      Áreas de Oportunidad Prioritarias
                    </span>
                    <span className="text-[9px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-300">
                      Punto Impacto (P.I.)
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {lecturaBreve.areasOportunidad.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="text-[11px]">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="font-bold text-slate-900">{item.dimension}</span>
                          {item.esPuntoImpacto && (
                            <span className="bg-rose-100 text-rose-800 text-[8.5px] font-black uppercase px-1 py-0.2 rounded border border-rose-300 inline-flex items-center gap-0.5">
                              <ShieldAlert className="w-2.5 h-2.5 text-rose-600" />
                              P.I.
                            </span>
                          )}
                        </div>
                        <p className="text-slate-700 mt-0.5 text-[11px] leading-snug">
                          {item.fraseExplicativa}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. ACCIONES RECOMENDADAS (TABLA COMPACTA DE 6 FILAS) */}
            <section className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="text-[11px] font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-sky-700 inline" />
                  Acciones Recomendadas (Enfoque Liderazgo Situacional - SLII)
                </h2>
                <span className="text-[9.5px] text-slate-500 font-medium">
                  Exactamente 6 filas: 3 para sostener fortalezas &bull; 3 para desarrollar oportunidades
                </span>
              </div>

              <div className="border border-slate-300 rounded overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-[10.5px]">
                  <thead>
                    <tr className="bg-slate-800 text-white font-bold uppercase text-[9px] tracking-wider">
                      <th className="py-1.5 px-2.5 w-[22%] border-r border-slate-700">Propósito</th>
                      <th className="py-1.5 px-2.5 w-[53%] border-r border-slate-700">
                        Acción Sugerida (Verbo observable + Situación + Frecuencia/Plazo + Enfoque SLII)
                      </th>
                      <th className="py-1.5 px-2.5 w-[25%]">Evidencia Breve de Aplicación</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {/* 3 Filas para Fortalezas */}
                    {accionesRecomendadas.paraFortalezas.slice(0, 3).map((row, idx) => (
                      <tr key={`f-${idx}`} className={idx % 2 === 0 ? "bg-emerald-50/20" : "bg-white"}>
                        <td className="py-1.5 px-2.5 font-bold text-emerald-900 border-r border-slate-200 align-top">
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            <span className="text-[10px]">{row.proposito}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-800 leading-snug border-r border-slate-200 align-top">
                          {row.accionSugerida}
                        </td>
                        <td className="py-1.5 px-2.5 font-medium text-slate-600 bg-slate-50/50 align-top">
                          <span className="text-slate-800 font-semibold">{row.evidenciaBreve}</span>
                        </td>
                      </tr>
                    ))}

                    {/* 3 Filas para Oportunidades */}
                    {accionesRecomendadas.paraOportunidades.slice(0, 3).map((row, idx) => (
                      <tr key={`o-${idx}`} className={idx % 2 === 0 ? "bg-rose-50/20" : "bg-white"}>
                        <td className="py-1.5 px-2.5 font-bold text-rose-900 border-r border-slate-200 align-top">
                          <div className="flex items-center gap-1">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            <span className="text-[10px]">{row.proposito}</span>
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-800 leading-snug border-r border-slate-200 align-top">
                          {row.accionSugerida}
                        </td>
                        <td className="py-1.5 px-2.5 font-medium text-slate-600 bg-slate-50/50 align-top">
                          <span className="text-slate-800 font-semibold">{row.evidenciaBreve}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. SEGUIMIENTO */}
            <section className="mb-3 bg-slate-50 border border-slate-200 rounded p-2.5">
              <div className="flex items-center justify-between mb-1 pb-1 border-b border-slate-200">
                <h2 className="text-[11px] font-black tracking-wider text-slate-900 uppercase flex items-center gap-1.5">
                  <CalendarCheck className="w-3.5 h-3.5 text-sky-700 inline" />
                  Seguimiento y Compromisos Acordados
                </h2>
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-sky-900">
                  <Calendar className="w-3 h-3 text-sky-600 inline" />
                  <span>Próximo encuentro: {seguimiento.fechaProximoEncuentro || "Por definir"}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-700 leading-snug">
                <span className="font-bold text-slate-900">Evidencia que se revisará: </span>
                {seguimiento.evidenciaARevisar ||
                  "Evidencia documentada de las acciones pactadas en la sesión de autodiagnóstico."}
              </div>
            </section>
          </>
        )}

        {/* Firmas de Formalización */}
        <div className="pt-1.5 pb-2 mb-2 border-t border-slate-200 grid grid-cols-2 gap-8 text-center">
          <div>
            <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
            <span className="text-[9.5px] font-bold uppercase text-slate-600 block">
              Firma del Líder Evaluado
            </span>
            <span className="text-[9.5px] text-slate-400">{header.nombre || "Colaborador"}</span>
          </div>
          <div>
            <div className="h-6 border-b border-dashed border-slate-400 mb-1"></div>
            <span className="text-[9.5px] font-bold uppercase text-slate-600 block">
              Firma del Facilitador / Coach
            </span>
            <span className="text-[9.5px] text-slate-400">Desarrollo Organizacional</span>
          </div>
        </div>

        {/* NOTA OBLIGATORIA AL PIE */}
        <footer className="pt-2 border-t border-slate-300 text-center">
          <p className="text-[10px] font-semibold text-slate-600 tracking-tight italic">
            "{notaAlPieObligatoria || "Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros."}"
          </p>
        </footer>
      </div>
    </div>
  );
};
