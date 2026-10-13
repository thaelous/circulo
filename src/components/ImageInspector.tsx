import React, { useState, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Sparkles, AlertTriangle, FileImage } from "lucide-react";
import { WheelDimension } from "../types/leadership";

interface ImageInspectorProps {
  imageUrl: string | null;
  dimensiones?: WheelDimension[];
  puntosPalanca?: string[];
  puntosImpacto?: string[];
  onUploadClick?: () => void;
}

export const ImageInspector: React.FC<ImageInspectorProps> = ({
  imageUrl,
  dimensiones = [],
  puntosPalanca = [],
  puntosImpacto = [],
  onUploadClick,
}) => {
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.75));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  if (!imageUrl) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50/50">
        <FileImage className="w-12 h-12 text-slate-400 mb-3" />
        <h3 className="font-bold text-slate-700 text-sm">No hay imagen cargada</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          Sube una foto de la rueda de liderazgo manuscrita o carga el caso de Claudia para probar.
        </p>
        {onUploadClick && (
          <button
            onClick={onUploadClick}
            className="px-4 py-2 bg-sky-700 hover:bg-sky-800 text-white font-medium text-xs rounded shadow transition"
          >
            Subir o Cargar Rueda
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shadow">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-slate-300 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-xs flex items-center gap-1.5">
            <FileImage className="w-3.5 h-3.5 text-sky-400" />
            Visor de Trazo y Notas Manuscritas
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            {Math.round(scale * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            title="Mostrar u ocultar marcadores de hallazgos"
            className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
              showAnnotations
                ? "bg-sky-600 text-white"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300"
            }`}
          >
            Anotaciones
          </button>
          <button
            onClick={handleZoomOut}
            title="Alejar"
            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomIn}
            title="Acercar"
            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReset}
            title="Restablecer vista"
            className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Viewport with Pan and Zoom */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 min-h-[380px] overflow-hidden flex items-center justify-center p-4 bg-slate-950 ${
          scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="relative max-w-full max-h-full flex items-center justify-center"
        >
          <img
            src={imageUrl}
            alt="Rueda Laboral de Liderazgo"
            className="max-h-[620px] max-w-full object-contain rounded shadow-2xl border border-slate-700/60"
            draggable={false}
          />
        </div>

        {/* Floating Summary Tags at Bottom */}
        {showAnnotations && (puntosPalanca.length > 0 || puntosImpacto.length > 0) && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 pointer-events-none">
            {puntosPalanca.map((p, idx) => (
              <div
                key={`p-${idx}`}
                className="bg-amber-950/90 backdrop-blur-sm border border-amber-500/70 text-amber-200 text-[11px] px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="font-bold">Palanca:</span>
                <span className="truncate max-w-[280px]">{p}</span>
              </div>
            ))}
            {puntosImpacto.map((imp, idx) => (
              <div
                key={`i-${idx}`}
                className="bg-rose-950/90 backdrop-blur-sm border border-rose-500/70 text-rose-200 text-[11px] px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span className="font-bold">Impacto:</span>
                <span className="truncate max-w-[280px]">{imp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Helpful Hint */}
      <div className="px-3 py-1.5 bg-slate-900 border-t border-slate-800 text-[10px] text-slate-400 flex justify-between items-center">
        <span>Usa los controles de zoom para inspeccionar trazos finos y escritura a mano.</span>
        {onUploadClick && (
          <button
            onClick={onUploadClick}
            className="text-sky-400 hover:text-sky-300 font-medium"
          >
            Cambiar imagen
          </button>
        )}
      </div>
    </div>
  );
};
