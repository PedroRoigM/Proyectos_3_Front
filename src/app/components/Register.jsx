// Componente: Login
// Devuelve un formulario de login con los campos de email y contraseña.
// Debe de mostrar un mensaje de error si el email no es válido.
// Debe de mostrar un mensaje de error si algún campo está vacío.
// Debe de mostrar un mensaje de éxito si el login se ha realizado correctamente.
// Debe de mostrar un spinner de carga mientras se realiza el login.

"use client";

import { useState } from 'react';
import PostRegister from './lib/register';



export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
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
        try {
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

            const response = await PostRegister(formData);
            if (response.error) {
                setError(response.error);
                setLoading(false);
                return;
            }

        } catch (err) {
            setError(err.message);
        }
    };
    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh', 
            padding: '20px',
            background: 'linear-gradient(to bottom,rgb(187, 187, 187),rgb(60, 60, 60))'
        }}>
            <div style={{
                backgroundColor: '#F5F5F5', 
                padding: '100px', 
                textAlign: 'center',
                borderRadius: '5px',
                fontFamily: 'Montserrat, sans-serif',
                width: '90%',
                maxWidth: '550px',
                }}>

                <h1 style={{ fontWeight: 'bold', color: 'black', margin: '10px', fontSize: '25px' }}>Registro</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
                {loading && <p style={{color: 'white'}}>Loading...</p>}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px', marginTop: '15px', textAlign: 'left' }}>
                        <label>
                            Usuario
                        </label>
                            <input
                                type="name"
                                name="name"
                                placeholder='name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ 
                                    color: 'black', 
                                    backgroundColor: 'white',
                                    fontFamily: 'Montserrat, sans-serif', 
                                    fontWeight: 'bold',
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '2px solid #000000',
                                    marginBottom: '10px'
                                }}
                            />
                    </div>
                    <div style={{ marginBottom: '15px', marginTop: '15px', textAlign: 'left' }}>
                        <label>
                            Email
                        </label>
                            <input
                                type="email"
                                name="email"
                                placeholder= "email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ 
                                    color: 'black', 
                                    backgroundColor: 'white',
                                    fontFamily: 'Montserrat, sans-serif', 
                                    fontWeight: 'bold',
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '2px solid #000000',
                                    marginBottom: '10px'
                                }}
                            />
                    </div>
                    <div style={{ marginBottom: '15px', marginTop: '15px', textAlign: 'left' }}>  
                        <label>
                            Contraseña
                        </label>                          
                            <input
                                type="password"
                                name="password"
                                placeholder= "password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{ 
                                    color: 'black', 
                                    backgroundColor: 'white',
                                    fontFamily: 'Montserrat, sans-serif', 
                                    fontWeight: 'bold',
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    border: '2px solid #000000',
                                    marginBottom: '10px'
                                    
                                }}
                            />
                    </div>
                    <label style={{ color: 'black', textAlign: 'left', display: 'block', fontSize: '12px' }}>
                        ¿Ha olvidado su contraseña?
                    </label>

                    <button type="submit" style={{
                        color: 'white',
                        backgroundColor: 'black',
                        border: '1px solid black',
                        padding: '10px 20px',
                        margin: '10px 5px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold'
                    }}>
                        INICIAR SESIÓN
                    </button>

                    <button type="submit" style={{
                        color: 'black',
                        border: '1px solid black',
                        padding: '10px 20px',
                        margin: '10px 5px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 'bold'
                    }}>
                        REGISTRARSE
                    </button>
                    
                </form>
            </div>
        </div>
    )
}