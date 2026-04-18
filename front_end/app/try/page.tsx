import Link from "next/link";

export default function Try() {
    return (
        <div className="max-w-2xl">
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-black text-slate-800 mb-4">Mis proyectos</h2>
                <Link
                    href="/proyectos"
                    className="inline-flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Crear nuevo proyecto
                </Link>
            </div>

        </div>
    );
}