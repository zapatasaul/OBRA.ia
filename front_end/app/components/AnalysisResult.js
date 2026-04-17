export default function AnalysisResult({ data }) {
  if (!data) return null;

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow border border-gray-200">
      <section>
        <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mb-4">
          🏗️ Factibilidad Estructural
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
              <li key={i}>{p}</li>
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
          🌍 Riesgos de Obra
        </h2>

        <h3 className="font-bold text-amber-700 mt-4 mb-2">
          Suelo (Geotécnicos)
        </h3>
        {data.riesgos.suelo.map((r, i) => (
          <div
            key={i}
            className="mb-3 text-sm border-l-4 border-amber-500 pl-3"
          >
            <p>
              <strong>Riesgo:</strong> {r.riesgo} (Probabilidad:{" "}
              {r.probabilidad})
            </p>
            <p>
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
            <p>
              <strong>Riesgo:</strong> {r.riesgo} (Probabilidad:{" "}
              {r.probabilidad})
            </p>
            <p>
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
