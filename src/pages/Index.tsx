
import { useState } from "react";
import { Search, BookOpen, User, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/projects", { state: { search: searchQuery } });
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate("/projects", { state: { category } });
  };

  return (
    <div className="min-h-screen bg-[#9FE92D]">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-utad-primary text-2xl font-bold">
              U-TAD TFM/TFG
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-600 hover:text-utad-primary transition-colors">
                Inicio
              </Link>
              <Link to="/projects" className="text-gray-600 hover:text-utad-primary transition-colors">
                Proyectos
              </Link>
              <Link to="/tutors" className="text-gray-600 hover:text-utad-primary transition-colors">
                Tutores
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-utad-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link to="/profile" className="p-2 text-gray-600 hover:text-utad-primary transition-colors">
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 animate-fadeIn">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h2 className="text-4xl font-bold text-utad-primary mb-4">
            Gestión de Trabajos Académicos
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre, gestiona y colabora en proyectos de fin de máster y grado de U-TAD
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto glass-panel p-2">
            <div className="flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-3" />
              <input
                type="text"
                placeholder="Buscar por título, autor o palabras clave..."
                className="w-full px-4 py-2 bg-transparent border-none focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button 
                className="button-primary ml-2"
                onClick={handleSearch}
              >
                Buscar
              </button>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="mb-16">
          <h3 className="text-2xl font-bold text-utad-primary mb-6">Proyectos Destacados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="glass-panel p-6 card-hover cursor-pointer"
                onClick={() => navigate(`/projects/${i}`)}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-utad-accent rounded-lg">
                    <BookOpen className="w-6 h-6 text-utad-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      Desarrollo de un Sistema de IA
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Un proyecto innovador que explora las posibilidades de la inteligencia artificial...
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-4">Autor: Juan Pérez</span>
                      <span>2023</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h3 className="text-2xl font-bold text-utad-primary mb-6">Categorías</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Ingeniería", "Diseño", "Animación", "Videojuegos"].map((category) => (
              <button
                key={category}
                className="glass-panel p-6 text-center card-hover"
                onClick={() => handleCategoryClick(category)}
              >
                <h4 className="font-semibold text-utad-primary">{category}</h4>
                <p className="text-sm text-gray-600 mt-2">
                  Ver proyectos
                </p>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-utad-primary text-white mt-24 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">U-TAD</h4>
              <p className="text-sm opacity-80">
                Centro Universitario de Tecnología y Arte Digital
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Enlaces Útiles</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Política de Privacidad</a></li>
                <li><a href="#" className="hover:opacity-100">Términos y Condiciones</a></li>
                <li><a href="#" className="hover:opacity-100">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Síguenos</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:opacity-100">Twitter</a></li>
                <li><a href="#" className="hover:opacity-100">LinkedIn</a></li>
                <li><a href="#" className="hover:opacity-100">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-sm opacity-60">
            <p>&copy; {new Date().getFullYear()} U-TAD. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
