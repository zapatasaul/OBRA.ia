import Link from "next/link";
import ProyectCard from "./components/proyectcard";

export default function Try() {
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
            <div className="w-full">
                <p className="text-slate-500 text-sm mt-1 p-4">
                    <ProyectCard />
                </p>
            </div>

        </div>
    );
}