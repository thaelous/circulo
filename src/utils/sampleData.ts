import { LeadershipAnalysis } from "../types/leadership";

export const sampleClaudiaAnalysis: LeadershipAnalysis = {
  header: {
    nombre: "Claudia Méndez",
    puesto: "Gerente de Operaciones",
    fechaAplicacion: "14 de Octubre de 2026",
    fechaSeguimiento: "18 de Noviembre de 2026",
  },
  graficaProyeccionDescripcion:
    "La gráfica de araña refleja una autoevaluación actual con picos destacados en Visión Estratégica (8.5/10) y Toma de Decisiones (8.5/10), contrastando con una concentración crítica en Delegación (4.5/10) y Gestión del Tiempo (5.0/10). La meta acordada a 5 semanas proyecta elevar Delegación a 7.5/10 y Gestión del Tiempo a 7.0/10, sosteniendo los pilares directivos por encima de 8.5.",
  dimensiones: [
    {
      nombre: "Visión Estratégica y Alineación",
      puntuacion: 8.5,
      metaProyeccion: 9.0,
      escala: "1-10",
      esPalanca: true,
      esImpacto: false,
      observacionesVisuales: "P.P. (Punto Palanca): Motor de coherencia y foco directivo",
    },
    {
      nombre: "Toma de Decisiones y Agilidad",
      puntuacion: 8.5,
      metaProyeccion: 8.5,
      escala: "1-10",
      esPalanca: false,
      esImpacto: false,
      observacionesVisuales: "Firmeza analítica y respuesta rápida ante contingencias",
    },
    {
      nombre: "Inteligencia Emocional y Relaciones",
      puntuacion: 8.0,
      metaProyeccion: 8.5,
      escala: "1-10",
      esPalanca: false,
      esImpacto: false,
      observacionesVisuales: "Empatía consolidada y serenidad en situaciones de tensión",
    },
    {
      nombre: "Rendición de Cuentas (Accountability)",
      puntuacion: 7.5,
      metaProyeccion: 8.0,
      escala: "1-10",
      esPalanca: false,
      esImpacto: false,
      observacionesVisuales: "Cumplimiento disciplinado de entregables del área",
    },
    {
      nombre: "Comunicación y Feedback",
      puntuacion: 7.0,
      metaProyeccion: 8.0,
      escala: "1-10",
      esPalanca: false,
      esImpacto: false,
      observacionesVisuales: "Canal abierto; pendiente institucionalizar feedback 1:1",
    },
    {
      nombre: "Desarrollo de Equipo y Mentoring",
      puntuacion: 6.0,
      metaProyeccion: 7.5,
      escala: "1-10",
      esPalanca: false,
      esImpacto: false,
      observacionesVisuales: "Disposición alta pero postergada por urgencias",
    },
    {
      nombre: "Gestión del Tiempo y Priorización",
      puntuacion: 5.0,
      metaProyeccion: 7.0,
      escala: "1-10",
      esPalanca: false,
      esImpacto: false,
      observacionesVisuales: "Agenda absorbida por demandas imprevistas del día a día",
    },
    {
      nombre: "Delegación y Empoderamiento",
      puntuacion: 4.5,
      metaProyeccion: 7.5,
      escala: "1-10",
      esPalanca: false,
      esImpacto: true,
      observacionesVisuales: "P.I. (Punto Impacto): Retención de autorizaciones y sobrecarga",
    },
  ],
  lecturaBreve: {
    fortalezas: [
      {
        dimension: "Visión Estratégica y Alineación",
        esPuntoPalanca: true,
        fraseExplicativa:
          "Articula y conecta con claridad los objetivos estratégicos con la operación de sus equipos, fungiendo como el principal Punto Palanca (P.P.) para apalancar el desarrollo.",
      },
      {
        dimension: "Toma de Decisiones y Agilidad",
        esPuntoPalanca: false,
        fraseExplicativa:
          "Resuelve dilemas operativos complejos con rapidez analítica, transmitiendo certidumbre técnica y liderazgo ante eventos imprevistos.",
      },
    ],
    areasOportunidad: [
      {
        dimension: "Delegación y Empoderamiento",
        esPuntoImpacto: true,
        fraseExplicativa:
          "Concentra revisiones y aprobaciones intermedias generando cuellos de botella y sobrecarga individual, identificándose como el Punto Impacto (P.I.) prioritario a desbloquear.",
      },
      {
        dimension: "Gestión del Tiempo y Priorización",
        esPuntoImpacto: false,
        fraseExplicativa:
          "Sacrifica bloques de planeación estratégica y acompañamiento de talento al atender urgencias operativas cotidianas de forma reactiva.",
      },
    ],
  },
  puntosPalancaIdentificados: [
    "P.P. - Visión Estratégica y Alineación (8.5/10): Ancla para traccionar autonomía y guiar al equipo",
  ],
  puntosImpactoIdentificados: [
    "P.I. - Delegación y Empoderamiento (4.5/10): Foco neurálgico para liberar capacidad y descomprimir agenda",
  ],
  accionesRecomendadas: {
    paraFortalezas: [
      {
        proposito: "Sostener Fortaleza (Visión Estratégica)",
        accionSugerida:
          "Modelar la traducción de metas estratégicas en los comités mensuales con coordinadores senior, transfiriendo la articulación de objetivos mediante enfoque SLII S4 (Delegar).",
        evidenciaBreve: "Minuta de comité mensual con metas cascada redactadas por los coordinadores.",
        verboObservable: "Modelar",
        enfoqueSLII: "S4 Delegar",
      },
      {
        proposito: "Sostener Fortaleza (Toma de Decisiones)",
        accionSugerida:
          "Documentar criterios de decisión y umbrales de autonomía para contingencias en una guía operativa rápida, facilitando la consulta quincenal mediante enfoque SLII S3 (Apoyar).",
        evidenciaBreve: "Guía de criterios de decisión de 1 página validada y distribuida al área.",
        verboObservable: "Documentar",
        enfoqueSLII: "S3 Apoyar",
      },
      {
        proposito: "Sostener Fortaleza (Inteligencia Emocional)",
        accionSugerida:
          "Conducir sesiones quincenales de calibración emocional y clima de trabajo al cierre de proyectos de alta presión, aplicando escucha activa con enfoque SLII S3 (Apoyar).",
        evidenciaBreve: "Registro de acuerdos de calibración y compromisos de equipo quincenales.",
        verboObservable: "Conducir",
        enfoqueSLII: "S3 Apoyar",
      },
    ],
    paraOportunidades: [
      {
        proposito: "Desarrollar Oportunidad (Delegación - P.I.)",
        accionSugerida:
          "Establecer una matriz de delegación estructurada (RACI) y transferir formalmente 2 autorizaciones operativas recurrentes de forma semanal con enfoque SLII S1/S2 (Dirigir y Entrenar).",
        evidenciaBreve: "Matriz RACI firmada y traspaso documentado de las dos aprobaciones.",
        verboObservable: "Establecer",
        enfoqueSLII: "S1/S2 Dirigir y Entrenar",
      },
      {
        proposito: "Desarrollar Oportunidad (Gestión del Tiempo)",
        accionSugerida:
          "Calendarizar e implementar dos bloques inamovibles de 90 minutos semanales (martes y jueves) para planeación táctica y mentoring, auditando su cumplimiento con enfoque SLII S1 (Dirigir).",
        evidenciaBreve: "Captura de calendario con bloques protegidos y registro de asistencia a mentoría.",
        verboObservable: "Calendarizar",
        enfoqueSLII: "S1 Dirigir",
      },
      {
        proposito: "Desarrollar Oportunidad (Desarrollo de Equipo)",
        accionSugerida:
          "Supervisar el desempeño de mandos medios en reuniones 1:1 quincenales de 30 minutos, evaluando su madurez de tarea y adaptando el estilo entre S2 (Guiar) y S3 (Apoyar).",
        evidenciaBreve: "Ficha breve de seguimiento 1:1 con notas de madurez por colaborador.",
        verboObservable: "Supervisar",
        enfoqueSLII: "S2/S3 Guiar y Apoyar",
      },
    ],
  },
  seguimiento: {
    evidenciaARevisar:
      "Matriz RACI de delegación firmada por el equipo, bitácora de agenda con bloques estratégicos protegidos (mar/jue) y minuta de acuerdos de las sesiones 1:1.",
    fechaProximoEncuentro: "18 de Noviembre de 2026",
  },
  notaAlPieObligatoria:
    "Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros.",
  resumenEjecutivoCuartilla: `REPORTE INDIVIDUAL DE RESULTADOS Y RECOMENDACIONES
RUEDA LABORAL APLICADA EN LIDERAZGO

1. ENCABEZADO
- Nombre: Claudia Méndez
- Puesto: Gerente de Operaciones
- Fecha de Aplicación: 14 de Octubre de 2026
- Fecha de Seguimiento: 18 de Noviembre de 2026

2. GRÁFICA Y PROYECCIÓN
La gráfica de araña refleja una autoevaluación actual con picos destacados en Visión Estratégica (8.5/10) y Toma de Decisiones (8.5/10), contrastando con una concentración crítica en Delegación (4.5/10) y Gestión del Tiempo (5.0/10). La meta acordada a 5 semanas proyecta elevar Delegación a 7.5/10 y Gestión del Tiempo a 7.0/10, sosteniendo los pilares directivos por encima de 8.5.
Nota: Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros.

3. LECTURA BREVE
Fortalezas Prioritarias:
1. Visión Estratégica y Alineación [P.P.]: Articula y conecta con claridad los objetivos estratégicos con la operación de sus equipos, fungiendo como el principal Punto Palanca (P.P.) para apalancar el desarrollo.
2. Toma de Decisiones y Agilidad: Resuelve dilemas operativos complejos con rapidez analítica, transmitiendo certidumbre técnica y liderazgo ante eventos imprevistos.

Áreas de Oportunidad Prioritarias:
1. Delegación y Empoderamiento [P.I.]: Concentra revisiones y aprobaciones intermedias generando cuellos de botella y sobrecarga individual, identificándose como el Punto Impacto (P.I.) prioritario a desbloquear.
2. Gestión del Tiempo y Priorización: Sacrifica bloques de planeación estratégica y acompañamiento de talento al atender urgencias operativas cotidianas de forma reactiva.

4. ACCIONES RECOMENDADAS (ENFOQUE SLII)
[Propósito] | [Acción sugerida] | [Evidencia breve de aplicación]
• Sostener Fortaleza (Visión) | Modelar la traducción de metas estratégicas en los comités mensuales con coordinadores senior, transfiriendo la articulación de objetivos mediante enfoque SLII S4 (Delegar). | Minuta de comité mensual con metas cascada.
• Sostener Fortaleza (Decisiones) | Documentar criterios de decisión y umbrales de autonomía para contingencias en una guía operativa rápida, facilitando la consulta quincenal mediante enfoque SLII S3 (Apoyar). | Guía de criterios de decisión de 1 página validada.
• Sostener Fortaleza (Inteligencia Emocional) | Conducir sesiones quincenales de calibración emocional y clima de trabajo al cierre de proyectos de alta presión, aplicando escucha activa con enfoque SLII S3 (Apoyar). | Registro de acuerdos de calibración quincenales.
• Desarrollar Oportunidad (Delegación - P.I.) | Establecer una matriz de delegación estructurada (RACI) y transferir formalmente 2 autorizaciones operativas recurrentes de forma semanal con enfoque SLII S1/S2 (Dirigir y Entrenar). | Matriz RACI firmada y traspaso documentado.
• Desarrollar Oportunidad (Gestión del Tiempo) | Calendarizar e implementar dos bloques inamovibles de 90 minutos semanales (martes y jueves) para planeación táctica y mentoring, auditando su cumplimiento con enfoque SLII S1 (Dirigir). | Captura de calendario con bloques protegidos.
• Desarrollar Oportunidad (Desarrollo de Equipo) | Supervisar el desempeño de mandos medios en reuniones 1:1 quincenales de 30 minutos, evaluando su madurez de tarea y adaptando el estilo entre S2 (Guiar) y S3 (Apoyar). | Ficha breve de seguimiento 1:1 con notas de madurez.

5. SEGUIMIENTO
- Evidencia a revisar: Matriz RACI de delegación firmada por el equipo, bitácora de agenda con bloques estratégicos protegidos (mar/jue) y minuta de acuerdos de las sesiones 1:1.
- Próximo encuentro registrado: 18 de Noviembre de 2026.

Nota obligatoria al pie:
"Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros."`,
};

/**
 * Generates an authentic visual canvas of Claudia's Leadership Wheel sheet
 * complete with circular diagram, current vs target projection traces,
 * handwritten annotations (P.P. & P.I.), and agreements.
 */
export function generateClaudiaSheetDataUrl(): string {
  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Textured warm paper background
  ctx.fillStyle = "#FDFBF7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = "#E2DACB";
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

  // Header Title
  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 30px sans-serif";
  ctx.fillText("HERRAMIENTA DE DESARROLLO ORGANIZACIONAL", 60, 85);

  ctx.fillStyle = "#475569";
  ctx.font = "19px sans-serif";
  ctx.fillText("Rueda Laboral aplicada en Liderazgo | Diagnóstico y Proyección", 60, 118);

  // Form Fields Box
  ctx.fillStyle = "#F8F5EE";
  ctx.fillRect(60, 140, canvas.width - 120, 105);
  ctx.strokeStyle = "#D1C7B7";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, 140, canvas.width - 120, 105);

  // Form Field Labels
  ctx.fillStyle = "#64748B";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("COLABORADOR / LÍDER:", 80, 175);
  ctx.fillText("PUESTO / ROL:", 650, 175);
  ctx.fillText("FECHA DE APLICACIÓN:", 80, 222);
  ctx.fillText("FECHA DE SEGUIMIENTO:", 650, 222);

  // Handwritten Values
  ctx.fillStyle = "#0F172A";
  ctx.font = "italic bold 22px 'Caveat', 'Segoe Script', cursive, sans-serif";
  ctx.fillText("Claudia Méndez", 280, 175);
  ctx.fillText("Gerente de Operaciones", 790, 175);
  ctx.fillText("14 de Octubre de 2026", 280, 222);
  ctx.fillText("18 de Noviembre de 2026", 850, 222);

  // Wheel center & radius
  const cx = canvas.width / 2;
  const cy = 690;
  const maxR = 330;

  const axes = [
    { name: "1. Visión Estratégica", score: 8.5, target: 9.0, pp: true, pi: false },
    { name: "2. Comunicación y Feedback", score: 7.0, target: 8.0, pp: false, pi: false },
    { name: "3. Delegación y Empoderamiento", score: 4.5, target: 7.5, pp: false, pi: true },
    { name: "4. Desarrollo de Equipo", score: 6.0, target: 7.5, pp: false, pi: false },
    { name: "5. Gestión del Tiempo", score: 5.0, target: 7.0, pp: false, pi: false },
    { name: "6. Inteligencia Emocional", score: 8.0, target: 8.5, pp: false, pi: false },
    { name: "7. Toma de Decisiones", score: 8.5, target: 8.5, pp: false, pi: false },
    { name: "8. Rendición de Cuentas", score: 7.5, target: 8.0, pp: false, pi: false },
  ];

  const numAxes = axes.length;

  // Concentric Circles (scale 1 to 10)
  for (let level = 1; level <= 10; level++) {
    const r = (maxR / 10) * level;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = level === 10 ? "#64748B" : level === 5 ? "#94A3B8" : "#E2E8F0";
    ctx.lineWidth = level === 10 || level === 5 ? 1.5 : 0.8;
    ctx.stroke();

    if (level % 2 === 0 || level === 5 || level === 10) {
      ctx.fillStyle = "#94A3B8";
      ctx.font = "12px sans-serif";
      ctx.fillText(`${level}`, cx + 4, cy - r + 11);
    }
  }

  // Radial axes lines & Labels
  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Axis label
    const labelDistance = maxR + 42;
    const lx = cx + Math.cos(angle) * labelDistance;
    const ly = cy + Math.sin(angle) * labelDistance;

    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(axes[i].name, lx, ly);

    // Score label handwritten next to rim
    const sx = cx + Math.cos(angle) * ((maxR / 10) * axes[i].score);
    const sy = cy + Math.sin(angle) * ((maxR / 10) * axes[i].score);
    ctx.fillStyle = "#1D4ED8";
    ctx.font = "italic bold 15px cursive, sans-serif";
    ctx.fillText(`${axes[i].score}`, sx + 14, sy - 8);
  }

  // Draw Projected Target Polygon (Dashed Green/Teal line)
  ctx.beginPath();
  ctx.setLineDash([6, 5]);
  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const r = (maxR / 10) * axes[i].target;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = "#059669";
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.setLineDash([]); // Reset dash

  // Draw Actual Score Polygon (Solid Filled Blue)
  ctx.beginPath();
  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const r = (maxR / 10) * axes[i].score;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = "rgba(14, 165, 233, 0.30)";
  ctx.fill();
  ctx.strokeStyle = "#0284C7";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Polygon point circles
  for (let i = 0; i < numAxes; i++) {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const r = (maxR / 10) * axes[i].score;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;

    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0, Math.PI * 2);
    ctx.fillStyle = axes[i].pp ? "#EAB308" : axes[i].pi ? "#DC2626" : "#0284C7";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Handwritten Callouts: P.P. and P.I.
  ctx.textAlign = "left";
  ctx.fillStyle = "#B45309";
  ctx.font = "italic bold 21px 'Caveat', 'Segoe Script', cursive, sans-serif";
  ctx.fillText("★ [P.P.] PUNTO PALANCA (8.5)", cx - 360, cy - 245);
  ctx.fillStyle = "#78350F";
  ctx.font = "italic 17px 'Caveat', 'Segoe Script', cursive, sans-serif";
  ctx.fillText("→ Visión como ancla para empoderar equipo", cx - 360, cy - 220);

  ctx.fillStyle = "#DC2626";
  ctx.font = "italic bold 21px 'Caveat', 'Segoe Script', cursive, sans-serif";
  ctx.fillText("⚠ [P.I.] PUNTO IMPACTO (4.5 → Meta 7.5)", cx + 160, cy + 85);
  ctx.fillStyle = "#991B1B";
  ctx.font = "italic 17px 'Caveat', 'Segoe Script', cursive, sans-serif";
  ctx.fillText("→ Urge delegar aprobaciones operativas", cx + 160, cy + 110);
  ctx.fillText("   Cuello de botella y sobrecarga personal", cx + 160, cy + 132);

  // Legend on image
  ctx.fillStyle = "#475569";
  ctx.font = "bold 13px sans-serif";
  ctx.fillText("Leyenda de trazos:  — Actual (Azul)   --- Proyección/Meta acordada (Verde)", cx - 260, cy + 395);

  // Lower Section: Acuerdos de Seguimiento & Evidencia
  const boxY = 1120;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(60, boxY, canvas.width - 120, 270);
  ctx.strokeStyle = "#CBD5E1";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(60, boxY, canvas.width - 120, 270);

  ctx.fillStyle = "#1E293B";
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("ACUERDOS DE SESIÓN Y SEGUIMIENTO REGISTRADOS:", 80, boxY + 30);

  ctx.fillStyle = "#0F172A";
  ctx.font = "italic 19px 'Caveat', 'Segoe Script', cursive, sans-serif";
  ctx.fillText("1. Proyección acordada: Elevar Delegación de 4.5 a 7.5 y Tiempo de 5.0 a 7.0 al plazo fijado.", 80, boxY + 68);
  ctx.fillText("2. Evidencia a revisar: Matriz RACI de delegación firmada y bitácora de agenda con bloques protegidos.", 80, boxY + 105);
  ctx.fillText("3. Modelo SLII: Aplicar S1/S2 en primeras transferencias operativas a coordinadores.", 80, boxY + 142);
  ctx.fillText("4. Fecha del próximo encuentro pactada: 18 de Noviembre de 2026.", 80, boxY + 179);
  ctx.fillText("Compromiso mutuo firmado entre facilitador y líder evaluado.", 80, boxY + 216);

  // Footer mandatory note
  ctx.fillStyle = "#64748B";
  ctx.font = "13px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(
    "Resultados basados en autoevaluación y diálogo individual; no constituyen una evaluación de desempeño de terceros.",
    canvas.width / 2,
    1445
  );

  return canvas.toDataURL("image/png");
}
