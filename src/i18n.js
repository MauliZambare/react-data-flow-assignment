import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "React Data Flow": "React Data Flow",
          "Posts Dashboard": "Posts Dashboard",
          "Search by title...": "Search by title...",
          "Refresh": "Refresh",
          "No matching posts found": "No matching posts found",
          "Page": "Page",
          "Prev": "Prev",
          "Next": "Next",
          "Add Node": "Add Node",
          "Loading posts...": "Loading posts...",
        },
      },
      es: {
        translation: {
          "React Data Flow": "Flujo de Datos en React",
          "Posts Dashboard": "Tablero de Publicaciones",
          "Search by title...": "Buscar por título...",
          "Refresh": "Refrescar",
          "No matching posts found": "No se encontraron publicaciones coincidentes",
          "Page": "Página",
          "Prev": "Anterior",
          "Next": "Siguiente",
          "Add Node": "Añadir Nodo",
          "Loading posts...": "Cargando publicaciones...",
        },
      },
    },
  });

export default i18n;
