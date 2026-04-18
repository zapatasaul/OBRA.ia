import Link from "next/link";

interface Project {
    id: number;
    proyectName: string;
    location: string;
    date: string;
    conditions: string;
    materials: string;
}

export default function ProjectCard({ project }: { project: Project }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Franja superior */}
            <div className="h-1 bg-gray-700 w-full" />

            {/* Contenido */}
            <div className="p-6 space-y-3">
                <h3 className="text-lg font-bold text-slate-800">
                    {project.proyectName}
                </h3>

                <div className="space-y-2">
                    <p className="text-sm text-slate-600">
                        <span className="font-semibold">Ubicación:</span> {project.location}
                    </p>
                    <p className="text-sm text-slate-600">
                        <span className="font-semibold">Condiciones:</span>{" "}
                        {project.conditions}
                    </p>
                    <p className="text-sm text-slate-600">
                        <span className="font-semibold">Materiales:</span> {project.materials}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                        Fecha: {new Date(project.date).toLocaleDateString("es-MX")}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-200 flex gap-2">
                <Link
                    href={`/try/${project.id}`}
                    className="flex-1 bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors text-center"
                >
                    Ver detalles
                </Link>
            </div>
        </div>
    );
}
