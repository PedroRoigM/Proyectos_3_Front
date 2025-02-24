
import React from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BookOpen, 
  Calendar, 
  User, 
  Tag, 
  Download, 
  ChevronLeft,
  Mail
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();

  // Mock data - en una implementación real, esto vendría de una API
  const project = {
    title: "Sistema de Recomendación basado en IA",
    author: "Juan Pérez",
    tutor: "Dra. Ana García",
    tutorEmail: "ana.garcia@u-tad.com",
    year: "2024",
    category: "Ingeniería",
    tags: ["Inteligencia Artificial", "Machine Learning", "Python"],
    abstract: `Este proyecto presenta el desarrollo de un sistema de recomendación 
    utilizando técnicas avanzadas de aprendizaje automático. El sistema analiza 
    los patrones de comportamiento de los usuarios y genera recomendaciones 
    personalizadas basadas en sus preferencias e interacciones previas.`,
    methodology: `La metodología empleada se basa en el uso de algoritmos de 
    filtrado colaborativo y procesamiento del lenguaje natural. Se implementaron 
    redes neuronales profundas para mejorar la precisión de las recomendaciones.`,
    conclusions: `Los resultados muestran una mejora significativa en la precisión 
    de las recomendaciones comparado con métodos tradicionales. El sistema 
    demuestra ser escalable y adaptable a diferentes contextos de aplicación.`
  };

  return (
    <div className="min-h-screen bg-[#9FE92D] py-12">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <Link 
          to="/projects" 
          className="inline-flex items-center text-utad-primary hover:text-utad-secondary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver a Proyectos
        </Link>

        {/* Header Section */}
        <div className="glass-panel p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="p-4 bg-utad-accent rounded-lg">
              <BookOpen className="w-8 h-8 text-utad-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-utad-primary mb-4">
                {project.title}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span>Autor: {project.author}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Año: {project.year}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tag className="w-4 h-4 mr-2" />
                  <span>Categoría: {project.category}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <a 
                    href={`mailto:${project.tutorEmail}`}
                    className="text-utad-secondary hover:text-utad-primary transition-colors"
                  >
                    Tutor: {project.tutor}
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-utad-accent text-utad-primary rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Abstract */}
            <section className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-utad-primary mb-4">
                Resumen
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {project.abstract}
              </p>
            </section>

            {/* Methodology */}
            <section className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-utad-primary mb-4">
                Metodología
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {project.methodology}
              </p>
            </section>

            {/* Conclusions */}
            <section className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-utad-primary mb-4">
                Conclusiones
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {project.conclusions}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Section */}
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-utad-primary mb-4">
                Documentos
              </h3>
              <button className="button-primary w-full flex items-center justify-center">
                <Download className="w-4 h-4 mr-2" />
                Ver Documento Completo
              </button>
              <p className="text-sm text-gray-500 mt-4">
                * Requiere autenticación para acceder al documento completo
              </p>
            </div>

            {/* Contact Info */}
            <div className="glass-panel p-6">
              <h3 className="font-semibold text-utad-primary mb-4">
                Contacto
              </h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${project.tutorEmail}`}
                  className="text-utad-secondary hover:text-utad-primary transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contactar con el tutor
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
