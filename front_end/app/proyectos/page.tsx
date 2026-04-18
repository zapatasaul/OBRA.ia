"use client";

import { useState, ChangeEvent } from "react";
import { analyzeDocument } from "../api/client";
import AnalysisResult from "../components/AnalysisResult";
import TechnicalChat from "../components/TechnicalChat";

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

export default function Proyectos() {
    const [file, setFile] = useState<File | null>(null);
    const [location, setLocation] = useState<string>("");
    const [conditions, setConditions] = useState<string>("");
    const [proyectName, setProjectName] = useState<string>("");
    const [materials, setMaterials] = useState<string>("");
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>("");

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !location) {
            alert("Sube un plano e ingresa la ubicación.");
            return;
        }
        setLoading(true);
        try {
            const data = await analyzeDocument(file, location, conditions, proyectName, materials);
            setAnalysisData(data);
        } catch (error) {
            alert("Error procesando el análisis estructural.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full bg-gray-200 p-10 rounded-xl">
            {/* Header de sección */}
            <div className="mb-8 border-b border-slate-200 pb-6">
                <p className="text-xs font-bold tracking-widest text-blue-700 uppercase mb-1">
                    Módulo de análisis
                </p>
                <h2 className="text-2xl font-black text-slate-800">Proyectos</h2>
                <p className="text-slate-500 text-sm mt-1">
                    Evaluación de Factibilidad Estructural y Análisis de Riesgos
                </p>
            </div>

            {!analysisData && (
                <div className="w-full">
                    {/* Card principal */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {/* Franja superior azul */}
                        <div className="h-1 bg-gray-700 w-full" />

                        <div className="p-6 space-y-5">
                            {/* Input archivo */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Plano o Memoria
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="flex-1 border-2 border-dashed border-slate-200 group-hover:border-gray-400 rounded-lg p-4 transition-colors text-center">
                                        <p className="text-sm font-semibold text-slate-600 group-hover:text-gray-600 transition-colors">
                                            {fileName ? fileName : "Haz clic para seleccionar PDF o imagen"}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">.pdf, .png, .jpg, .jpeg</p>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,image/*"
                                    />
                                </label>
                            </div>

                            {/* Input ubicación */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Ubicación del Proyecto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Ciudad de México, Suelo lacustre"
                                    className="w-full border border-slate-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            {/* Input nombre del proyecto */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Nombre del Proyecto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Torre Habitacional Norte"
                                    className="w-full border border-slate-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                                    value={proyectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                            </div>

                            {/* Input condiciones del terreno */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Condiciones del Terreno
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Pendiente suave, humedad alta"
                                    className="w-full border border-slate-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                                    value={conditions}
                                    onChange={(e) => setConditions(e.target.value)}
                                />
                            </div>

                            {/* Input materiales principales */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Materiales Principales
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Concreto armado, acero estructural"
                                    className="w-full border border-slate-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-100 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all"
                                    value={materials}
                                    onChange={(e) => setMaterials(e.target.value)}
                                />
                            </div>

                            {/* Botón */}
                            <button
                                onClick={handleAnalyze}
                                disabled={loading}
                                className="w-full bg-gray-800 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Calculando Factibilidad y Riesgos...
                                    </>
                                ) : (
                                    "Ejecutar Análisis Técnico →"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Nota informativa */}
                    <p className="text-xs text-slate-400 mt-4 text-center">
                        El análisis puede tardar algunos segundos dependiendo del documento.
                    </p>
                </div>
            )}

            {analysisData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AnalysisResult data={analysisData} />
                    <div className="h-[600px]">
                        <TechnicalChat context={analysisData} />
                    </div>
                </div>
            )}
        </div>
    );
}