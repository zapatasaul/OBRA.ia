import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OBRA.ai - Análisis Estructural',
  description: 'Evaluación de Factibilidad Estructural y Análisis de Riesgos de Obra',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}