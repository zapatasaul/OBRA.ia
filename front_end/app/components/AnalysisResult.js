export default function AnalysisResult({ data, previewUrl }) {
  if (!data) return null;

  const level = data.impacto_global?.nivel_riesgo_general || "Medio";
  const levelStyles = {
    Bajo: "bg-emerald-100 text-emerald-700",
    Medio: "bg-amber-100 text-amber-700",
    Alto: "bg-orange-100 text-orange-800",
    Crítico: "bg-red-100 text-red-700",
  };
  const costStyles =
    level === "Alto" || level === "Crítico"
      ? "text-red-700"
      : "text-emerald-700";
  const delayStyles = "text-slate-800";
  const borderColor = {
    Bajo: "border-emerald-500",
    Medio: "border-amber-500",
    Alto: "border-orange-500",
    Crítico: "border-red-500",
  }[level];

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-slate-200">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Nivel de Riesgo
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${levelStyles[level]}`}
            >
              {level.charAt(0)}
            </span>
            <div>
              <p className="text-sm text-slate-500">Impacto general</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {level}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Sobrecosto estimado
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
              %
            </div>
            <div>
              <p className="text-sm text-slate-500">Costo adicional</p>
              <p className={`mt-1 text-2xl font-semibold ${costStyles}`}>
                {data.impacto_global?.sobrecosto_estimado_porcentaje || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Retraso estimado
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-700">
              ⏱
            </div>
            <div>
              <p className="text-sm text-slate-500">Tiempo adicional</p>
              <p className={`mt-1 text-2xl font-semibold ${delayStyles}`}>
                {data.impacto_global?.retraso_estimado_tiempo || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl bg-slate-50 p-5 border-l-4 ${borderColor} shadow-sm`}
      >
        <p className="text-sm font-semibold text-slate-700">
          Justificación Financiera
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {data.impacto_global?.justificacion_financiera ||
            "No hay justificación financiera disponible."}
        </p>
      </div>

      {previewUrl && data.estructura?.problemas_detectados?.length > 0 && (
        <div className="relative overflow-hidden rounded-xl border border-slate-200">
          <img
            src={previewUrl}
            alt="Plano detectado"
            className="w-full h-auto object-contain"
          />
          {data.estructura.problemas_detectados.map((problem, i) => {
            const coords = problem?.coordenadas_caja;
            if (!Array.isArray(coords) || coords.length !== 4) return null;
            const [ymin, xmin, ymax, xmax] = coords;
            const style = {
              top: `${(ymin / 1000) * 100}%`,
              left: `${(xmin / 1000) * 100}%`,
              height: `${((ymax - ymin) / 1000) * 100}%`,
              width: `${((xmax - xmin) / 1000) * 100}%`,
            };
            return (
              <div
                key={i}
                className="absolute border-2 border-red-500 bg-red-500/20 rounded cursor-pointer transition-all hover:bg-red-500/40"
                style={style}
                title={`${i + 1}. ${problem.descripcion}`}
              >
                <span className="absolute top-0 left-0 px-1 text-[10px] font-semibold text-white bg-red-600/90 rounded-br-md">
                  {i + 1}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <section>
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">
          Factibilidad Estructural
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="bg-slate-50 p-3 rounded">
            <span className="font-semibold">Tipo:</span> {data.estructura.tipo}
          </div>
          <div className="bg-slate-50 p-3 rounded">
            <span className="font-semibold">Viabilidad:</span>{" "}
            {data.estructura.factibilidad}
          </div>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-red-600">Problemas Detectados:</p>
          <ul className="list-disc pl-5 mb-3">
            {data.estructura.problemas_detectados.map((p, i) => (
              <li key={i}>{typeof p === "string" ? p : p.descripcion}</li>
            ))}
          </ul>
          <p className="font-semibold text-green-700">Recomendaciones:</p>
          <ul className="list-disc pl-5">
            {data.estructura.recomendaciones.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">
          Riesgos de Obra
        </h2>

        <h3 className="font-bold text-amber-700 mt-4 mb-2">
          Suelo (Geotécnicos)
        </h3>
        {data.riesgos.suelo.map((r, i) => (
          <div
            key={i}
            className="mb-3 text-sm border-l-4 border-amber-500 pl-3"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="font-semibold text-slate-800">Riesgo: {r.riesgo}</p>
              <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                {r.impacto_costo_tiempo || "N/A"}
              </span>
            </div>
            <p className="text-sm text-slate-700 mb-1">
              <strong>Probabilidad:</strong> {r.probabilidad}
            </p>
            <p className="text-sm text-slate-700 mb-1">
              <strong>Impacto:</strong> {r.impacto}
            </p>
            <p className="text-slate-600">
              <em>Mitigación: {r.recomendacion}</em>
            </p>
          </div>
        ))}

        <h3 className="font-bold text-blue-700 mt-4 mb-2">
          Clima (Histórico/Proyectado)
        </h3>
        {data.riesgos.clima.map((r, i) => (
          <div key={i} className="mb-3 text-sm border-l-4 border-blue-500 pl-3">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="font-semibold text-slate-800">Riesgo: {r.riesgo}</p>
              <span className="text-xs font-semibold bg-red-100 text-red-800 px-2 py-1 rounded-full">
                {r.impacto_costo_tiempo || "N/A"}
              </span>
            </div>
            <p className="text-sm text-slate-700 mb-1">
              <strong>Probabilidad:</strong> {r.probabilidad}
            </p>
            <p className="text-sm text-slate-700 mb-1">
              <strong>Impacto:</strong> {r.impacto}
            </p>
            <p className="text-slate-600">
              <em>Mitigación: {r.recomendacion}</em>
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
