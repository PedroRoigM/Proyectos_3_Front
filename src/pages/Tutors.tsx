
import React from "react";
import { Mail, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Tutors = () => {
  const tutors = [
    {
      name: "Dr. Ana García",
      specialty: "Inteligencia Artificial",
      department: "Ingeniería",
      email: "ana.garcia@u-tad.com"
    },
    {
      name: "Dr. Carlos Martínez",
      specialty: "Desarrollo de Videojuegos",
      department: "Diseño",
      email: "carlos.martinez@u-tad.com"
    },
    {
      name: "Dra. Laura Sánchez",
      specialty: "Animación 3D",
      department: "Animación",
      email: "laura.sanchez@u-tad.com"
    }
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <Link 
        to="/" 
        className="inline-flex items-center text-utad-primary hover:text-utad-secondary mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver al Inicio
      </Link>

      <h1 className="text-3xl font-bold text-utad-primary mb-8">Tutores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor, index) => (
          <div key={index} className="glass-panel p-6">
            <h3 className="font-semibold text-lg text-utad-primary mb-2">{tutor.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{tutor.specialty}</p>
            <p className="text-sm text-gray-600 mb-4">{tutor.department}</p>
            <a 
              href={`mailto:${tutor.email}`}
              className="inline-flex items-center text-sm text-utad-secondary hover:text-utad-primary transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contactar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutors;
