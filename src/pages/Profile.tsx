
import React from "react";
import { User, Mail, BookOpen, Calendar, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="container mx-auto px-6 py-12">
      <Link 
        to="/" 
        className="inline-flex items-center text-utad-primary hover:text-utad-secondary mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Volver al Inicio
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-32 h-32 bg-utad-accent rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-utad-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-utad-primary mb-2">Juan Pérez</h1>
              <p className="text-gray-600 mb-4">Estudiante de Ingeniería del Software</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  juan.perez@live.u-tad.com
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  4º curso
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 mb-8">
          <h2 className="text-xl font-semibold text-utad-primary mb-4">Mi TFG</h2>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-utad-accent rounded-lg">
              <BookOpen className="w-6 h-6 text-utad-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Sistema de Recomendación basado en IA
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Desarrollo de un sistema de recomendación utilizando técnicas de aprendizaje automático...
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-4">Tutor: Dra. Ana García</span>
                <span>2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
