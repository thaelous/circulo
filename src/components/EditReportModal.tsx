import React, { useState } from "react";
import { LeadershipAnalysis } from "../types/leadership";
import { X, Check, Edit3 } from "lucide-react";

interface EditReportModalProps {
  analysis: LeadershipAnalysis;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: LeadershipAnalysis) => void;
}

export const EditReportModal: React.FC<EditReportModalProps> = ({
  analysis,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<LeadershipAnalysis>(() =>
    JSON.parse(JSON.stringify(analysis))
  );

  if (!isOpen) return null;

  const handleHeaderChange = (field: keyof typeof formData.header, value: string) => {
    setFormData((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        [field]: value,
      },
    }));
  };

  const handleActionChange = (
    category: "paraFortalezas" | "paraOportunidades",
    index: number,
    field: "proposito" | "accionSugerida" | "evidenciaBreve",
    value: string
  ) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const list = [...updated.accionesRecomendadas[category]];
      if (list[index]) {
        list[index] = { ...list[index], [field]: value };
        updated.accionesRecomendadas[category] = list;
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl my-8 overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-sky-400" />
            <h2 className="font-bold text-sm">Ajustar Datos del Reporte Cuartilla</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* 1. Encabezado */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b">
              1. Encabezado
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.header.nombre}
                  onChange={(e) => handleHeaderChange("nombre", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Puesto (si aplica)</label>
                <input
                  type="text"
                  value={formData.header.puesto}
                  onChange={(e) => handleHeaderChange("puesto", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fecha de Aplicación</label>
                <input
                  type="text"
                  value={formData.header.fechaAplicacion}
                  onChange={(e) => handleHeaderChange("fechaAplicacion", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fecha de Seguimiento</label>
                <input
                  type="text"
                  value={formData.header.fechaSeguimiento}
                  onChange={(e) => handleHeaderChange("fechaSeguimiento", e.target.value)}
                  className="w-full px-3 py-1.5 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 2. Gráfica y Proyección */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b">
              2. Gráfica y Proyección
            </h3>
            <textarea
              rows={2}
              value={formData.graficaProyeccionDescripcion}
              onChange={(e) =>
                setFormData({ ...formData, graficaProyeccionDescripcion: e.target.value })
              }
              className="w-full p-2 border rounded border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Describe el panorama de la gráfica de araña (autoevaluación actual y meta acordada)..."
            />
          </div>

          {/* 3. Lectura Breve (Máx 4 frases) */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b">
              3. Lectura Breve (Máx. 4 Frases)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2 bg-emerald-50/50 p-2.5 rounded border border-emerald-200">
                <span className="font-bold text-emerald-900 block text-[11px]">Fortalezas Prioritarias (P.P.)</span>
                {formData.lecturaBreve.fortalezas.map((f, idx) => (
                  <div key={idx} className="space-y-1">
                    <input
                      type="text"
                      value={f.dimension}
                      onChange={(e) => {
                        const copy = [...formData.lecturaBreve.fortalezas];
                        copy[idx].dimension = e.target.value;
                        setFormData({ ...formData, lecturaBreve: { ...formData.lecturaBreve, fortalezas: copy } });
                      }}
                      className="font-bold text-slate-900 bg-white border px-2 py-1 rounded w-full"
                    />
                    <textarea
                      rows={2}
                      value={f.fraseExplicativa}
                      onChange={(e) => {
                        const copy = [...formData.lecturaBreve.fortalezas];
                        copy[idx].fraseExplicativa = e.target.value;
                        setFormData({ ...formData, lecturaBreve: { ...formData.lecturaBreve, fortalezas: copy } });
                      }}
                      className="w-full p-1.5 border rounded border-emerald-300 bg-white"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2 bg-rose-50/50 p-2.5 rounded border border-rose-200">
                <span className="font-bold text-rose-900 block text-[11px]">Áreas de Oportunidad (P.I.)</span>
                {formData.lecturaBreve.areasOportunidad.map((o, idx) => (
                  <div key={idx} className="space-y-1">
                    <input
                      type="text"
                      value={o.dimension}
                      onChange={(e) => {
                        const copy = [...formData.lecturaBreve.areasOportunidad];
                        copy[idx].dimension = e.target.value;
                        setFormData({ ...formData, lecturaBreve: { ...formData.lecturaBreve, areasOportunidad: copy } });
                      }}
                      className="font-bold text-slate-900 bg-white border px-2 py-1 rounded w-full"
                    />
                    <textarea
                      rows={2}
                      value={o.fraseExplicativa}
                      onChange={(e) => {
                        const copy = [...formData.lecturaBreve.areasOportunidad];
                        copy[idx].fraseExplicativa = e.target.value;
                        setFormData({ ...formData, lecturaBreve: { ...formData.lecturaBreve, areasOportunidad: copy } });
                      }}
                      className="w-full p-1.5 border rounded border-rose-300 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Acciones Recomendadas (Tabla 6 filas) */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b">
              4. Acciones Recomendadas: [Propósito] | [Acción sugerida con SLII] | [Evidencia breve]
            </h3>
            <div className="space-y-3">
              <div className="space-y-2">
                <span className="font-bold text-emerald-800 text-[11px]">Para Sostener Fortalezas (3 Filas)</span>
                {formData.accionesRecomendadas.paraFortalezas.map((act, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-50 p-2 rounded border">
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] text-slate-500 font-bold block">Propósito</label>
                      <input
                        type="text"
                        value={act.proposito}
                        onChange={(e) => handleActionChange("paraFortalezas", idx, "proposito", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="text-[9.5px] text-slate-500 font-bold block">Acción Sugerida (SLII)</label>
                      <textarea
                        rows={2}
                        value={act.accionSugerida}
                        onChange={(e) => handleActionChange("paraFortalezas", idx, "accionSugerida", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white text-[11px]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] text-slate-500 font-bold block">Evidencia Breve</label>
                      <input
                        type="text"
                        value={act.evidenciaBreve}
                        onChange={(e) => handleActionChange("paraFortalezas", idx, "evidenciaBreve", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-rose-800 text-[11px]">Para Desarrollar Oportunidades (3 Filas)</span>
                {formData.accionesRecomendadas.paraOportunidades.map((act, idx) => (
                  <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-50 p-2 rounded border">
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] text-slate-500 font-bold block">Propósito</label>
                      <input
                        type="text"
                        value={act.proposito}
                        onChange={(e) => handleActionChange("paraOportunidades", idx, "proposito", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white font-semibold"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="text-[9.5px] text-slate-500 font-bold block">Acción Sugerida (SLII)</label>
                      <textarea
                        rows={2}
                        value={act.accionSugerida}
                        onChange={(e) => handleActionChange("paraOportunidades", idx, "accionSugerida", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white text-[11px]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="text-[9.5px] text-slate-500 font-bold block">Evidencia Breve</label>
                      <input
                        type="text"
                        value={act.evidenciaBreve}
                        onChange={(e) => handleActionChange("paraOportunidades", idx, "evidenciaBreve", e.target.value)}
                        className="w-full px-2 py-1 border rounded bg-white text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Seguimiento */}
          <div>
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2 pb-1 border-b">
              5. Seguimiento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Evidencia que se revisará</label>
                <textarea
                  rows={2}
                  value={formData.seguimiento.evidenciaARevisar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seguimiento: { ...formData.seguimiento, evidenciaARevisar: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fecha del próximo encuentro</label>
                <input
                  type="text"
                  value={formData.seguimiento.fechaProximoEncuentro}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seguimiento: { ...formData.seguimiento, fechaProximoEncuentro: e.target.value },
                    })
                  }
                  className="w-full px-2 py-1 border rounded bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded border-slate-300 hover:bg-slate-100 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded flex items-center gap-1.5 shadow"
            >
              <Check className="w-3.5 h-3.5" />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
