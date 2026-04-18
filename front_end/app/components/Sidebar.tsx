"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home", icon: "🏠" },
        { href: "/try", label: "Proyectos", icon: "📐" },
    ];

    return (
        <aside className="w-56 bg-gray-800 flex flex-col py-8 px-4 gap-2 shrink-0">
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-4 px-2">
                Menú
            </p>
            {links.map(({ href, label, icon }) => {
                const isActive = pathname === href;
                return (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-sm transition-colors
              ${isActive
                                ? "bg-white text-blue-700"
                                : "text-white hover:bg-blue-600"
                            }`}
                    >
                        <span>{icon}</span>
                        {label}
                    </Link>
                );
            })}
        </aside>
    );
}