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
            const margin = 50;
            const contentWidth = pageWidth - margin * 2;
            const innerMargin = 10;
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
                const lines = doc.splitTextToSize(safe(text), contentWidth);
                const requiredHeight = 14 + (lines.length * 11) + 8;
                ensureSpace(requiredHeight);
                
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(100, 116, 139);
                doc.text(label.toUpperCase(), margin, y);
                y += 11;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(color[0], color[1], color[2]);

                for (const line of lines) {
                    ensureSpace(11);
                    doc.text(line, margin, y);
                    y += 11;
                }
                y += 6;
            };

            const drawBulletList = (
                title: string,
                items: string[],
                bulletColor: [number, number, number],
            ) => {
                if (!items?.length) return;

                ensureSpace(20);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(30, 41, 59);
                doc.text(title, margin, y);
                y += 12;

                for (const item of items) {
                    const bulletWidth = contentWidth - 16;
                    const lines = doc.splitTextToSize(safe(item), bulletWidth);
                    ensureSpace(lines.length * 10 + 4);

                    doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2]);
                    doc.circle(margin + 6, y - 2, 2.2, "F");

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    doc.setTextColor(51, 65, 85);

                    lines.forEach((line: string, index: number) => {
                        doc.text(line, margin + 14, y + index * 10);
                    });

                    y += lines.length * 10 + 3;
                }

                y += 4;
            };

            const drawRiskBlock = (title: string, risks: any[], accent: [number, number, number]) => {
                if (!risks?.length) return;

                ensureSpace(18);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(accent[0], accent[1], accent[2]);
                doc.text(title, margin, y);
                y += 10;

                risks.forEach((risk, idx) => {
                    const textWidth = contentWidth - 2;
                    
                    // Título del riesgo
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.setTextColor(accent[0], accent[1], accent[2]);
                    const titleText = `${idx + 1}. ${safe(risk?.riesgo)}`;
                    const titleLines = doc.splitTextToSize(titleText, textWidth);
                    ensureSpace(titleLines.length * 12 + 30);
                    titleLines.forEach((line: string, index: number) => {
                        doc.text(line, margin, y + index * 12);
                    });
                    y += titleLines.length * 12 + 5;

                    // Impacto
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(51, 65, 85);
                    doc.setFontSize(9);
                    const impactoText = `Impacto: ${safe(risk?.impacto)}`;
                    const impactoLines = doc.splitTextToSize(impactoText, textWidth);
                    impactoLines.forEach((line: string, index: number) => {
                        doc.text(line, margin, y + index * 11);
                    });
                    y += impactoLines.length * 11 + 4;

                    // Probabilidad
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(51, 65, 85);
                    doc.setFontSize(9);
                    const probText = `Probabilidad: ${safe(risk?.probabilidad)}`;
                    const probLines = doc.splitTextToSize(probText, textWidth);
                    probLines.forEach((line: string, index: number) => {
                        doc.text(line, margin, y + index * 11);
                    });
                    y += probLines.length * 11 + 4;

                    // Recomendación
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(51, 65, 85);
                    doc.setFontSize(9);
                    const recText = `Recomendación: ${safe(risk?.recomendacion)}`;
                    const recLines = doc.splitTextToSize(recText, textWidth);
                    recLines.forEach((line: string, index: number) => {
                        doc.text(line, margin, y + index * 11);
                    });
                    y += recLines.length * 11 + 8;
                });
            };

            // Encabezado decorativo
            doc.setFillColor(31, 41, 55);
            doc.roundedRect(margin, y, contentWidth, 80, 6, 6, "F");
            doc.setFillColor(29, 78, 216);
            doc.rect(margin, y + 68, contentWidth, 12, "F");

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(255, 255, 255);
            
            const titleLines = doc.splitTextToSize("Reporte Técnico de Proyecto", contentWidth - 20);
            const titleStartY = y + (titleLines.length === 1 ? 22 : 16);
            titleLines.forEach((line: string, idx: number) => {
                doc.text(line, margin + 10, titleStartY + idx * 10);
            });

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const projectNameLines = doc.splitTextToSize(safe(project.proyectName), contentWidth - 20);
            let nameY = titleStartY + (titleLines.length * 10) + 6;
            projectNameLines.forEach((line: string) => {
                doc.text(line, margin + 10, nameY);
                nameY += 10;
            });
            
            doc.text(`Fecha: ${new Date(project.date).toLocaleDateString("es-MX")}`, margin + 10, nameY + 2);
            y += 92;

            drawWrapped("Ubicacion", project.location);
            drawWrapped("Condiciones del Terreno", project.conditions);
            drawWrapped("Materiales", project.materials);
            drawWrapped("Fecha de Analisis", new Date(project.date).toLocaleDateString("es-MX"));

            if (analysisData?.estructura) {
                ensureSpace(24);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.setTextColor(30, 64, 175);
                doc.text("Análisis Estructural", margin, y);
                y += 10;

                drawWrapped("Tipo de Estructura", analysisData.estructura.tipo);
                drawWrapped("Factibilidad", analysisData.estructura.factibilidad);
                drawBulletList("Problemas Detectados", analysisData.estructura.problemas_detectados || [], [220, 38, 38]);
                drawBulletList("Recomendaciones", analysisData.estructura.recomendaciones || [], [22, 163, 74]);
                y += 4;
            }

            if (analysisData?.riesgos) {
                ensureSpace(22);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(13);
                doc.setTextColor(146, 64, 14);
                doc.text("Análisis de Riesgos", margin, y);
                y += 10;

                drawRiskBlock("Riesgos del Suelo", analysisData.riesgos.suelo || [], [180, 83, 9]);
                drawRiskBlock("Riesgos Climáticos", analysisData.riesgos.clima || [], [29, 78, 216]);
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

                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                            <div className="bg-slate-50 p-3 rounded">
                                <span className="font-semibold">Tipo:</span> {analysisData.estructura.tipo}
                            </div>
                            <div className="bg-slate-50 p-3 rounded">
                                <span className="font-semibold">Viabilidad:</span>{" "}
                                {analysisData.estructura.factibilidad}
                            </div>
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-red-600">Problemas Detectados:</p>
                            <ul className="list-disc pl-5 mb-3">
                                {analysisData.estructura.problemas_detectados.map((p: any, i: number) => (
                                    <li key={i}>{typeof p === "string" ? p : p.descripcion}</li>
                                ))}
                            </ul>
                            <p className="font-semibold text-green-700">Recomendaciones:</p>
                            <ul className="list-disc pl-5">
                                {analysisData.estructura.recomendaciones.map((r: string, i: number) => (
                                    <li key={i}>{r}</li>
                                ))}
                            </ul>
                        </div>
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
