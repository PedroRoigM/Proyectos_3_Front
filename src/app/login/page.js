// Componente: Login
// Devuelve un formulario de login con los campos de email y contraseña.
// Debe de mostrar un mensaje de error si el email no es válido.
// Debe de mostrar un mensaje de error si algún campo está vacío.
// Debe de mostrar un mensaje de éxito si el login se ha realizado correctamente.
// Debe de mostrar un spinner de carga mientras se realiza el login.

"use client";

import React, { useState } from 'react';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validaciones
    if (!formData.email || !formData.password) {
      setError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('El email no es válido.');
      setLoading(false);
      return;
    }

    // Simulación de login
    try {
      const response = await fetch('https://api-937n.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.errors.map(err => err.msg).join(', '));
      } else {
        setSuccess('Login realizado correctamente.');
      }
    } catch (err) {
      setError('No se ha podido realizar el login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ color: 'black', backgroundColor: 'white' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Contraseña:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ color: 'black', backgroundColor: 'white' }}
            />
          </label>
        </div>
        <button type="submit" style={{
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          margin: '10px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em'
        }}>
          Login
        </button>
      </form>
    </div>
  );
}