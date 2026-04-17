"use client";

import { useState, ChangeEvent } from "react";
import { analyzeDocument } from "./api/client";
import AnalysisResult from "./components/AnalysisResult";
import TechnicalChat from "./components/TechnicalChat";

// Definición de tipos para la estructura de datos que devuelve el backend
interface AnalysisData {
  estructura: {
    tipo: string;
    factibilidad: string;
    problemas_detectados: string[];
    recomendaciones: string[];
  };
  riesgos: {
    suelo: Array<{ riesgo: string; impacto: string; probabilidad: string; recomendacion: string }>;
    clima: Array<{ riesgo: string; impacto: string; probabilidad: string; recomendacion: string }>;
  };
  texto_extraido: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<string>("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !location) {
      alert("Sube un plano e ingresa la ubicación.");
      return;
    }
    
    setLoading(true);
    try {
      const data = await analyzeDocument(file, location);
      setAnalysisData(data);
    } catch (error) {
      alert("Error procesando el análisis estructural.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-800 mb-2">OBRA.ai</h1>
        <p className="text-slate-600 mb-8">Evaluación de Factibilidad Estructural y Análisis de Riesgos</p>

        {!analysisData && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-xl">
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Plano o Memoria (PDF/Img)
              </label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="w-full border p-2 rounded" 
                accept=".pdf,image/*"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Ubicación del Proyecto
              </label>
              <input 
                type="text" 
                placeholder="Ej: Ciudad de México, Suelo lacustre" 
                className="w-full border p-2 rounded text-black"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="w-full bg-slate-800 text-white font-bold py-3 rounded hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Calculando Factibilidad y Riesgos...' : 'Ejecutar Análisis Técnico'}
            </button>
          </div>
        )}

        {analysisData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <AnalysisResult data={analysisData} />
            <div className="h-[600px]">
              <TechnicalChat context={analysisData} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}