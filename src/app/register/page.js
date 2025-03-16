// Componente: Register
// Devuelve un formulario de registro con los campos de nombre, apellidos, email, contraseña y confirmación de contraseña.
// Debe de mostrar un mensaje de error si las contraseñas no coinciden.
// Debe de mostrar un mensaje de error si el email no es válido.
// Debe de mostrar un mensaje de error si algún campo está vacío.
// Debe de mostrar un mensaje de éxito si el registro se ha realizado correctamente.
// Debe de mostrar un spinner de carga mientras se realiza el registro.
// Debe de mostrar un mensaje de error si el registro no se ha podido realizar.
// Debe de mostrar un mensaje de error si el email ya está registrado.
// Debe de mostrar un mensaje de error si la contraseña es demasiado corta.
// Componente: Register
// Devuelve un formulario de registro con los campos de nombre, apellidos, email, contraseña y confirmación de contraseña.
// Debe de mostrar un mensaje de error si las contraseñas no coinciden.
// Debe de mostrar un mensaje de error si el email no es válido.
// Debe de mostrar un mensaje de error si algún campo está vacío.
// Debe de mostrar un mensaje de éxito si el registro se ha realizado correctamente.
// Debe de mostrar un spinner de carga mientras se realiza el registro.
// Debe de mostrar un mensaje de error si el registro no se ha podido realizar.
// Debe de mostrar un mensaje de error si el email ya está registrado.
// Debe de mostrar un mensaje de error si la contraseña es demasiado corta.

"use client";

import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('El email no es válido.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña es demasiado corta.');
      setLoading(false);
      return;
    }

    // Simulación de registro
    try {
      const response = await fetch('https://api-937n.onrender.com/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.errors.map(err => err.msg).join(', '));
      } else {
        setSuccess('Registro realizado correctamente.');
      }
    } catch (err) {
      setError('No se ha podido realizar el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Nombre:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Apellidos:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
        <div style={{ marginBottom: '15px' }}>
          <label>
            Confirmar Contraseña:
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
          Register
        </button>
      </form>
    </div>
  );
}