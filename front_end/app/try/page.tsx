"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProjectCard from "./components/ProjectCard";
import { fetchProjects } from "../api/client";

interface Project {
  id: number;
  proyectName: string;
  date: string;
  location: string;
  conditions: string;
  materials: string;
}

export default function Try() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error loading projects:", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    return (
        <div className="w-full bg-gray-200 p-10 rounded-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-black text-slate-800 mb-4">Mis proyectos</h2>
                <Link
                    href="/proyectos"
                    className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Crear nuevo proyecto
                </Link>
            </div>
            <div className="w-full mt-6">
                {loading ? (
                    <p className="text-slate-500 text-sm p-4">Cargando proyectos...</p>
                ) : projects.length === 0 ? (
                    <p className="text-slate-500 text-sm p-4">No hay proyectos disponibles.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}