'use client';
import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import { ErrorBoundary } from './components/errors/error-boundary';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);

  // Función para cambiar entre Login y Register
  const toggleAuthMode = () => {
    setShowLogin((prevState) => !prevState);
  };

  return (
    <div className="font-montserrat rounded-md from-white to-gray-400 bg-gradient-to-b h-screen">
      <ErrorBoundary>
        {showLogin ? (
          <Login changeToRegister={toggleAuthMode} />
        ) : (
          <Register changeToLogin={toggleAuthMode} />
        )}
      </ErrorBoundary>
    </div>
  );
}