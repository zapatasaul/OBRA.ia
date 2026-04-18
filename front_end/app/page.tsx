import Image from 'next/image'
import geminiLogo from './gemini_logo.png'
export default function Home() {
  return (
    <div className="w-full mb-6 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden">

      {/* Línea azul superior */}
      <div className="h-[3px] bg-blue-600" />

      <div className="p-8 pt-7">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest uppercase text-blue-600">
              Módulo de análisis
            </span>
            <h1 className="text-2xl font-bold text-slate-800 mt-1.5 leading-tight">
              Análisis estructural con IA
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mt-2 max-w-lg">
              Sube un plano o memoria y OBRA.ai identifica riesgos estructurales,
              detecta inconsistencias y propone mejoras antes de la ejecución.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-3 shrink-0 flex flex-col items-center gap-1">
            <Image src={geminiLogo} alt="Gemini Logo" width={24} height={24} />
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Gemini AI</span>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            { value: "+40", label: "parámetros evaluados" },
            { value: "4", label: "formatos de archivo" },
            { value: "100%", label: "en tiempo real" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-center">
              <p className="text-lg font-bold text-slate-800 leading-none mb-1">{s.value}</p>
              <p className="text-[11px] text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Flujo: cómo funciona */}
        <div className="bg-white border border-slate-200 rounded-lg px-6 py-5 mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">
            Cómo funciona
          </p>
          <div className="flex items-center">

            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e40af"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="13" y2="17" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-700">Llena el formulario</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Plano + datos del proyecto</p>
            </div>

            <div className="flex-none w-10 flex items-center justify-center pb-5">
              <svg width="24" height="10" viewBox="0 0 24 10">
                <line x1="0" y1="5" x2="18" y2="5" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <polyline points="13,1 19,5 13,9" fill="none" stroke="#cbd5e1" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-700">OBRA.ai analiza</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Agente inteligente</p>
            </div>

            <div className="flex-none w-10 flex items-center justify-center pb-5">
              <svg width="24" height="10" viewBox="0 0 24 10">
                <line x1="0" y1="5" x2="18" y2="5" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                <polyline points="13,1 19,5 13,9" fill="none" stroke="#cbd5e1" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="flex-1 text-center">
              <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803d"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-700">Recibes el reporte</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Riesgos y mejoras</p>
            </div>

          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {[
            {
              bg: "bg-red-50", border: "border-red-100", stroke: "#991b1b",
              icon: (
                <>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </>
              ),
              title: "Riesgos potenciales",
              desc: "Detecta puntos críticos que podrían comprometer la integridad estructural del proyecto.",
            },
            {
              bg: "bg-blue-50", border: "border-blue-100", stroke: "#1e3a8a",
              icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
              title: "Diagnóstico técnico",
              desc: "Evalúa el estado general del diseño con base en normativas y buenas prácticas de ingeniería.",
            },
            {
              bg: "bg-green-50", border: "border-green-100", stroke: "#14532d",
              icon: (
                <>
                  <polyline points="16 3 21 3 21 8" />
                  <line x1="4" y1="20" x2="21" y2="3" />
                  <polyline points="21 16 21 21 16 21" />
                  <line x1="15" y1="15" x2="21" y2="21" />
                </>
              ),
              title: "Mejora del diseño",
              desc: "Propone ajustes en secciones, materiales y conexiones para optimizar seguridad y costos.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-slate-200 rounded-lg p-4">
              <div className={`w-7 h-7 ${f.bg} border ${f.border} rounded-md flex items-center justify-center mb-2.5`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={f.stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon}
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-slate-800 mb-1">{f.title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Nota informativa */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5">
          <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-[12px] text-blue-700 leading-relaxed">
            El análisis considera ubicación, condiciones del terreno y materiales indicados.
            A mayor detalle en el formulario, más preciso será el resultado.
          </p>
        </div>

        {/* Footer formatos */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-400">Formatos aceptados:</span>
          {["PDF", "PNG", "JPG", "JPEG"].map((f) => (
            <span key={f}
              className="text-[11px] font-medium px-2.5 py-1 rounded bg-white text-slate-500 border border-slate-200">
              {f}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}