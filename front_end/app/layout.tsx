import type { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import AppBar from "./components/AppBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "OBRA.ai",
  description: "Evaluación de Factibilidad Estructural y Análisis de Riesgos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="flex h-screen overflow-hidden bg-slate-100">
        {/* Sidebar izquierdo */}
        <Sidebar />

        {/* Contenido principal */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <AppBar />
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}