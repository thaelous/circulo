export interface WheelDimension {
  nombre: string;
  puntuacion: number; // puntuación actual (1 a 10 o %)
  metaProyeccion?: number; // meta acordada si se observa
  escala?: string;
  esPalanca?: boolean; // P.P.
  esImpacto?: boolean; // P.I.
  observacionesVisuales?: string;
}

export interface ReportHeader {
  nombre: string;
  puesto: string;
  fechaAplicacion: string;
  fechaSeguimiento: string;
}

export interface Finding {
  dimension: string;
  esPuntoPalanca?: boolean;
  esPuntoImpacto?: boolean;
  fraseExplicativa: string;
}

export interface LecturaBreve {
  fortalezas: Finding[]; // hasta 2
  areasOportunidad: Finding[]; // hasta 2
  // Máximo 4 frases en total entre fortalezas y oportunidades
}

export interface CompactActionRow {
  proposito: string; // "Sostener Fortaleza" o "Desarrollar Oportunidad"
  accionSugerida: string; // Verbo observable + situación de aplicación + frecuencia/plazo + enfoque SLII
  evidenciaBreve: string; // Evidencia breve de aplicación
  // Desglose auxiliar para badges en UI si está disponible
  verboObservable?: string;
  enfoqueSLII?: string;
}

export interface AccionesRecomendadasTabla {
  paraFortalezas: CompactActionRow[]; // exactamente 3
  paraOportunidades: CompactActionRow[]; // exactamente 3
}

export interface SeguimientoAcordado {
  evidenciaARevisar: string;
  fechaProximoEncuentro: string;
}

export interface LeadershipAnalysis {
  header: ReportHeader;
  graficaProyeccionDescripcion: string;
  dimensiones: WheelDimension[];
  lecturaBreve: LecturaBreve;
  puntosPalancaIdentificados: string[];
  puntosImpactoIdentificados: string[];
  accionesRecomendadas: AccionesRecomendadasTabla;
  seguimiento: SeguimientoAcordado;
  notaAlPieObligatoria: string;
  resumenEjecutivoCuartilla?: string;
  isRawText?: boolean;
  rawMarkdown?: string;
}
