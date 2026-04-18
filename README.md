# OBRA.ia

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0+-38B2AC)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Google-orange)](https://ai.google.dev/)

## 📋 Descripción

OBRA.ia es una plataforma inteligente de análisis estructural y evaluación de riesgos para proyectos de construcción. Utiliza inteligencia artificial avanzada (Gemini de Google) para analizar planos, documentos y datos de ubicación, proporcionando evaluaciones precisas de riesgos geotécnicos, climáticos y estructurales. Genera reportes PDF detallados con recomendaciones técnicas y estimaciones financieras.

La aplicación combina un backend robusto en Node.js con un frontend moderno en Next.js, ofreciendo una experiencia de usuario intuitiva para ingenieros, constructores y project managers.

## ✨ Características Principales

- **Análisis Inteligente de Documentos**: Procesamiento de PDFs, planos e imágenes usando IA generativa.
- **Evaluación de Riesgos**: Análisis detallado de riesgos del suelo, clima y estructura.
- **Estimaciones Financieras**: Cálculos automáticos de sobrecostos y retrasos.
- **Reportes PDF Profesionales**: Generación automática de reportes técnicos con gráficos y datos.
- **Interfaz Moderna**: Diseño responsivo con TailwindCSS y componentes reutilizables.
- **API RESTful**: Backend escalable con endpoints bien documentados.
- **Detección Visual**: Identificación automática de problemas en planos con coordenadas normalizadas.

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** - Entorno de ejecución JavaScript del lado del servidor
- **Express.js** - Framework web minimalista para Node.js
- **@google/generative-ai** - SDK de Google Gemini para IA generativa
- **Multer** - Middleware para manejo de archivos multipart/form-data
- **CORS** - Middleware para habilitar CORS
- **Dotenv** - Gestión de variables de entorno

### Frontend

- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca para interfaces de usuario
- **TypeScript** - JavaScript con tipado estático
- **TailwindCSS** - Framework CSS utilitario
- **Axios** - Cliente HTTP para peticiones a la API
- **jsPDF** - Generación de PDFs del lado del cliente
- **Lucide React** - Iconos SVG modernos

### Base de Datos

- **SQLite** (o compatible) con entidades TypeScript para registros SQL

## 🚀 Instalación y Ejecución

### Prerrequisitos

- **Node.js** versión 18 o superior
- **npm** o **yarn** como gestor de paquetes
- **Git** para clonar el repositorio
- **Cuenta de Google AI Studio** con API key de Gemini

### Clonación del Repositorio

```bash
git clone https://github.com/zapatasaul/OBRA.ia.git
cd OBRA.ia
```

### Configuración del Backend

1. Navega al directorio del backend:

   ```bash
   cd back_end
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del backend con las siguientes variables:

   ```env
   GEMINI_API_KEY=tu_clave_api_de_gemini_aqui
   PORT=4000
   NODE_ENV=development
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
   El backend estará disponible en `http://localhost:4000`.

### Configuración del Frontend

1. Abre una nueva terminal y navega al directorio del frontend:

   ```bash
   cd front_end
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env.local` (opcional, si necesitas variables específicas):

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:3000`.

### Verificación

- Abre tu navegador y ve a `http://localhost:3000`
- El backend debe estar corriendo en `http://localhost:4000`
- Prueba subir un archivo y generar un análisis

## 📖 Uso

1. **Acceso a la Plataforma**: Navega a la página principal y selecciona "Proyectos".

2. **Crear un Nuevo Proyecto**:
   - Ingresa el nombre del proyecto
   - Proporciona la ubicación
   - Detalla las condiciones del terreno y materiales

3. **Subir Documentos**:
   - Soporta archivos PDF, PNG, JPG, JPEG
   - La IA analizará automáticamente el contenido

4. **Análisis Automático**:
   - El sistema evalúa riesgos estructurales
   - Analiza condiciones geotécnicas y climáticas
   - Genera estimaciones financieras

5. **Generar Reporte**:
   - Descarga un PDF profesional con todos los hallazgos
   - Incluye visualización de problemas detectados en planos

## 🏗️ Arquitectura del Proyecto

```
obra-ia/
├── back_end/                 # API REST en Node.js
│   ├── src/
│   │   ├── controllers/      # Controladores de rutas
│   │   ├── entities/         # Definiciones de entidades SQL
│   │   ├── middlewares/      # Middlewares personalizados
│   │   ├── routes/           # Definición de rutas API
│   │   ├── services/         # Servicios de negocio (Gemini AI)
│   │   └── utils/            # Utilidades (extracción PDF)
│   ├── index.js              # Punto de entrada del servidor
│   └── package.json
├── front_end/                # Aplicación Next.js
│   ├── app/                  # App Router de Next.js
│   │   ├── api/              # Rutas API del frontend
│   │   ├── components/       # Componentes React reutilizables
│   │   ├── proyectos/        # Página de gestión de proyectos
│   │   ├── try/              # Páginas de proyectos individuales
│   │   └── globals.css       # Estilos globales
│   ├── public/               # Archivos estáticos
│   └── package.json
└── README.md                 # Este archivo
```

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue las convenciones de código de TypeScript y ESLint
- Escribe tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Asegúrate de que el build pase sin errores

---

⭐ Si encuentras útil este proyecto, ¡dale una estrella en GitHub!

Desarrollado con ❤️ para la comunidad de ingeniería civil y construcción.
