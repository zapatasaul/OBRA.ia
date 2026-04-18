"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { fetchProjects } from "../../api/client";

interface ProjectDetails {
    id: number;
    proyectName: string;
    location: string;
    date: string;
    conditions: string;
    materials: string;
    proyectDescription: string | null;
    apiResult: string;
}

export default function ProjectDetails({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState<any>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const createPdfReport = () => {
        if (!project) return;

        setIsGeneratingPdf(true);
        try {
            const doc = new jsPDF({ unit: "pt", format: "a4" });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pageWidth - margin * 2;
            let y = margin;

            const safe = (value: unknown) => {
                if (value === null || value === undefined || value === "") return "No disponible";
                return String(value);
            };

            const ensureSpace = (requiredHeight: number) => {
                if (y + requiredHeight > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
            };

            const drawWrapped = (
                label: string,
                text: string,
                color: [number, number, number] = [51, 65, 85],
            ) => {
                ensureSpace(38);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(100, 116, 139);
                doc.text(label.toUpperCase(), margin, y);
                y += 14;

                const lines = doc.splitTextToSize(safe(text), contentWidth);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.setTextColor(color[0], color[1], color[2]);

                for (const line of lines) {
                    ensureSpace(16);
                    doc.text(line, margin, y);
                    y += 14;
                }
                y += 8;
            };

            const drawBulletList = (
                title: string,
                items: string[],
                bulletColor: [number, number, number],
            ) => {
                if (!items?.length) return;

                ensureSpace(24);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(30, 41, 59);
                doc.text(title, margin, y);
                y += 16;

                for (const item of items) {
                    const lines = doc.splitTextToSize(safe(item), contentWidth - 18);
                    ensureSpace(lines.length * 14 + 6);

                    doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2]);
                    doc.circle(margin + 5, y - 4, 2, "F");

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(11);
                    doc.setTextColor(51, 65, 85);

                    lines.forEach((line: string, index: number) => {
                        doc.text(line, margin + 14, y + index * 14);
                    });

                    y += lines.length * 14 + 4;
                }

                y += 8;
            };

            const drawRiskBlock = (title: string, risks: any[], accent: [number, number, number]) => {
                if (!risks?.length) return;

                ensureSpace(28);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.setTextColor(accent[0], accent[1], accent[2]);
                doc.text(title, margin, y);
                y += 18;

                risks.forEach((risk, idx) => {
                    ensureSpace(88);
                    doc.setFillColor(248, 250, 252);
                    doc.setDrawColor(accent[0], accent[1], accent[2]);
                    doc.roundedRect(margin, y - 11, contentWidth, 78, 6, 6, "FD");

                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(11);
                    doc.setTextColor(accent[0], accent[1], accent[2]);
                    doc.text(`${idx + 1}. ${safe(risk?.riesgo)}`, margin + 10, y + 4);

                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(51, 65, 85);
                    doc.setFontSize(10);
                    doc.text(`Impacto: ${safe(risk?.impacto)}`, margin + 10, y + 20);
                    doc.text(`Probabilidad: ${safe(risk?.probabilidad)}`, margin + 10, y + 34);

                    const recLines = doc.splitTextToSize(
                        `Recomendacion: ${safe(risk?.recomendacion)}`,
                        contentWidth - 20,
                    );
                    doc.text(recLines, margin + 10, y + 48);
                    y += 90;
                });
            };

            // Encabezado decorativo
            doc.setFillColor(31, 41, 55);
            doc.roundedRect(margin, y, contentWidth, 92, 10, 10, "F");
            doc.setFillColor(29, 78, 216);
            doc.rect(margin, y + 78, contentWidth, 14, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(22);
            doc.setTextColor(255, 255, 255);
            doc.text("Reporte Tecnico de Proyecto", margin + 18, y + 32);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(safe(project.proyectName), margin + 18, y + 52);
            doc.text(`Fecha: ${new Date(project.date).toLocaleDateString("es-MX")}`, margin + 18, y + 70);
            y += 118;

            drawWrapped("Ubicacion", project.location);
            drawWrapped("Condiciones del Terreno", project.conditions);
            drawWrapped("Materiales", project.materials);
            drawWrapped("Fecha de Analisis", new Date(project.date).toLocaleDateString("es-MX"));

            if (analysisData?.estructura) {
                ensureSpace(30);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(30, 64, 175);
                doc.text("Analisis Estructural", margin, y);
                y += 16;

                drawWrapped("Tipo de Estructura", analysisData.estructura.tipo);
                drawWrapped("Factibilidad", analysisData.estructura.factibilidad);
                drawBulletList("Problemas Detectados", analysisData.estructura.problemas_detectados || [], [220, 38, 38]);
                drawBulletList("Recomendaciones", analysisData.estructura.recomendaciones || [], [22, 163, 74]);
            }

            if (analysisData?.riesgos) {
                ensureSpace(30);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(16);
                doc.setTextColor(146, 64, 14);
                doc.text("Analisis de Riesgos", margin, y);
                y += 18;

                drawRiskBlock("Riesgos del Suelo", analysisData.riesgos.suelo || [], [180, 83, 9]);
                drawRiskBlock("Riesgos Climaticos", analysisData.riesgos.clima || [], [29, 78, 216]);
            }

            const fileName = `reporte-${safe(project.proyectName).replace(/\s+/g, "-").toLowerCase()}.pdf`;
            doc.save(fileName);
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    useEffect(() => {
        const loadProject = async () => {
            try {
                const projects = await fetchProjects();
                const found = projects.find((p: any) => p.id === parseInt(params.id));
                if (found) {
                    setProject(found);
                    try {
                        setAnalysisData(JSON.parse(found.apiResult));
                    } catch (e) {
                        console.error("Error parsing analysis data:", e);
                    }
                }
            } catch (error) {
                console.error("Error loading project:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProject();
    }, [params.id]);

    if (loading)
        return (
            <div className="w-full p-10 text-slate-500">Cargando proyecto...</div>
        );
    if (!project)
        return (
            <div className="w-full p-10 text-red-600">Proyecto no encontrado.</div>
        );

    return (
        <div className="w-full bg-gray-200 p-10 rounded-xl min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/try"
                    className="inline-flex items-center text-blue-700 hover:text-blue-800 font-semibold text-sm mb-4"
                >
                    ← Volver a proyectos
                </Link>
                <div className="border-b border-slate-200 pb-6">
                    <p className="text-xs font-bold tracking-widest text-blue-700 uppercase mb-1">
                        Detalles del proyecto
                    </p>
                    <h1 className="text-3xl font-black text-slate-800">{project.proyectName}</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {new Date(project.date).toLocaleDateString("es-MX")}
                    </p>
                    <button
                        type="button"
                        onClick={createPdfReport}
                        disabled={isGeneratingPdf}
                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-700 to-slate-800 px-5 py-3 text-sm font-bold tracking-wide text-white shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isGeneratingPdf ? "Generando PDF..." : "Descargar Reporte PDF"}
                    </button>
                </div>
            </div>

            {/* Información del Proyecto */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="h-1 bg-gray-700 w-full" />
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Ubicación
                            </h3>
                            <p className="text-slate-800 font-semibold">{project.location}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Condiciones del Terreno
                            </h3>
                            <p className="text-slate-800 font-semibold">{project.conditions}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Materiales
                            </h3>
                            <p className="text-slate-800 font-semibold">{project.materials}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                Fecha de Análisis
                            </h3>
                            <p className="text-slate-800 font-semibold">
                                {new Date(project.date).toLocaleDateString("es-MX")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Análisis Estructural */}
            {analysisData?.estructura && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                    <div className="h-1 bg-blue-700 w-full" />
                    <div className="p-8 space-y-4">
                        <h2 className="text-2xl font-black text-slate-800">
                            Análisis Estructural
                        </h2>

                        <div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                                Tipo de Estructura
                            </h3>
                            <p className="text-slate-700">{analysisData.estructura.tipo}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-2">
                                Factibilidad
                            </h3>
                            <p className="text-slate-700">{analysisData.estructura.factibilidad}</p>
                        </div>

                        {analysisData.estructura.problemas_detectados?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-red-700 uppercase tracking-widest mb-3">
                                    Problemas Detectados
                                </h3>
                                <ul className="space-y-2">
                                    {analysisData.estructura.problemas_detectados.map(
                                        (problema: string, idx: number) => (
                                            <li
                                                key={idx}
                                                className="text-sm text-slate-700 flex gap-3"
                                            >
                                                <span className="text-red-600 font-bold">•</span>
                                                {problema}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        {analysisData.estructura.recomendaciones?.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-3">
                                    Recomendaciones
                                </h3>
                                <ul className="space-y-2">
                                    {analysisData.estructura.recomendaciones.map(
                                        (rec: string, idx: number) => (
                                            <li key={idx} className="text-sm text-slate-700 flex gap-3">
                                                <span className="text-green-600 font-bold">✓</span>
                                                {rec}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Análisis de Riesgos */}
            {analysisData?.riesgos && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="h-1 bg-amber-700 w-full" />
                    <div className="p-8 space-y-6">
                        <h2 className="text-2xl font-black text-slate-800">
                            Análisis de Riesgos
                        </h2>

                        {/* Riesgos de Suelo */}
                        {analysisData.riesgos.suelo?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">
                                    Riesgos del Suelo
                                </h3>
                                <div className="space-y-4">
                                    {analysisData.riesgos.suelo.map(
                                        (riesgo: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="p-4 border border-amber-200 rounded-lg bg-amber-50"
                                            >
                                                <p className="font-semibold text-amber-900 mb-2">
                                                    {riesgo.riesgo}
                                                </p>
                                                <p className="text-sm text-slate-700 mb-2">
                                                    <span className="font-semibold">Impacto:</span>{" "}
                                                    {riesgo.impacto}
                                                </p>
                                                <p className="text-sm text-slate-700 mb-2">
                                                    <span className="font-semibold">Probabilidad:</span>{" "}
                                                    {riesgo.probabilidad}
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    <span className="font-semibold">Recomendación:</span>{" "}
                                                    {riesgo.recomendacion}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Riesgos de Clima */}
                        {analysisData.riesgos.clima?.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 mb-4">
                                    Riesgos Climáticos
                                </h3>
                                <div className="space-y-4">
                                    {analysisData.riesgos.clima.map(
                                        (riesgo: any, idx: number) => (
                                            <div
                                                key={idx}
                                                className="p-4 border border-blue-200 rounded-lg bg-blue-50"
                                            >
                                                <p className="font-semibold text-blue-900 mb-2">
                                                    {riesgo.riesgo}
                                                </p>
                                                <p className="text-sm text-slate-700 mb-2">
                                                    <span className="font-semibold">Impacto:</span>{" "}
                                                    {riesgo.impacto}
                                                </p>
                                                <p className="text-sm text-slate-700 mb-2">
                                                    <span className="font-semibold">Probabilidad:</span>{" "}
                                                    {riesgo.probabilidad}
                                                </p>
                                                <p className="text-sm text-slate-700">
                                                    <span className="font-semibold">Recomendación:</span>{" "}
                                                    {riesgo.recomendacion}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
