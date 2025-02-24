import React from "react";
import { Search, ChevronLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Sistema de Recomendación basado en IA",
      description: "Un proyecto innovador que explora las posibilidades de la inteligencia artificial y el aprendizaje automático.",
      author: "Juan Pérez",
      year: "2024",
      category: "Ingeniería"
    },
    {
      id: 2,
      title: "Videojuego de Realidad Virtual",
      description: "Desarrollo de una experiencia inmersiva utilizando las últimas tecnologías de VR.",
      author: "María López",
      year: "2023",
      category: "Videojuegos"
    },
    {
      id: 3,
      title: "Cortometraje Animado 3D",
      description: "Una historia emotiva creada completamente en 3D utilizando técnicas avanzadas de animación.",
      author: "Carlos Ruiz",
      year: "2024",
      category: "Animación"
    },
    {
      id: 4,
      title: "Diseño de Interfaz Adaptativa",
      description: "Sistema de diseño que se adapta a las necesidades y preferencias del usuario.",
      author: "Ana Martínez",
      year: "2023",
      category: "Diseño"
    },
    {
      id: 5,
      title: "Motor de Física para Videojuegos",
      description: "Implementación de un motor de física optimizado para juegos en tiempo real.",
      author: "David García",
      year: "2024",
      category: "Videojuegos"
    },
    {
      id: 6,
      title: "Sistema de Procesamiento de Lenguaje Natural",
      description: "Desarrollo de algoritmos para el análisis y comprensión del lenguaje humano.",
      author: "Laura Sánchez",
      year: "2023",
      category: "Ingeniería"
    }
  ];

  return (
    <div className="min-h-screen bg-[#9FE92D]">
      <div className="container mx-auto px-6 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-utad-primary hover:text-utad-secondary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver al Inicio
        </Link>

        <h1 className="text-3xl font-bold text-utad-primary mb-8">Proyectos</h1>
        
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar proyectos..."
                  className="w-full pl-10 input-primary"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select className="input-primary">
                <option value="">Categoría</option>
                <option value="engineering">Ingeniería</option>
                <option value="design">Diseño</option>
                <option value="animation">Animación</option>
                <option value="games">Videojuegos</option>
              </select>
              <select className="input-primary">
                <option value="">Año</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}`}
              className="glass-panel p-6 card-hover"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-utad-accent rounded-lg">
                  <BookOpen className="w-6 h-6 text-utad-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">Autor: {project.author}</span>
                    <span>{project.year}</span>
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 bg-utad-accent text-utad-primary rounded-full text-sm">
                    {project.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
