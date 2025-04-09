'use client';
import { useState } from "react";
import PostRecoverPassword from "../components/lib/PostRecoverPassword";
import PatchRecoverPassword from "../components/lib/PatchRecoverPassword";
import { recoverPasswordStyles, inputClassName } from "../components/styles/recover-password";

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
    });
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    }

    const handleSubmit = async () => {
        let newErrors = {};
        if (step === 1) {
            if (!formData.email) {
                newErrors.account = 'El email es obligatorio';
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const response = await PostRecoverPassword(formData.email);
            if (!response.success) {
                setErrors({ account: 'El email no existe' });
                return;
            } else {
                setErrors({ account: '' });
            }
            setStep(2);
        } else if (step === 2) {
            if (!formData.code) {
                newErrors.code = 'El código es obligatorio';
            }
            if (!formData.password) {
                newErrors.account = 'La contraseña es obligatoria';
            }
            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }
            const response = await PatchRecoverPassword(formData);
            if (!response.success) {
                setErrors(response);
                return;
            } else {
                setErrors({ code: '', account: '' });
            }
            setStep(3);
        }
    }

    const handleRollback = () => {
        if (step === 1) {
            window.location.href = '/';
            return;
        }
        if (step === 2) {
            setFormData({
                email: formData.email,
                code: '',
                password: '',
            });
        }
        setStep(step - 1);
    }

    return (
        <div className={recoverPasswordStyles.layout.container}>
            <div className={recoverPasswordStyles.layout.wrapper}>
                <div className={recoverPasswordStyles.layout.formContainer}>
                    <h1 className={recoverPasswordStyles.headings.title}>Recuperar contraseña</h1>

                    {step === 1 && (
                        <div>
                            <p className={recoverPasswordStyles.headings.paragraph}>Introduce tu correo electrónico</p>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClassName(errors.account)}
                            />
                            {errors.account && <p className={recoverPasswordStyles.form.error}>{errors.account}</p>}
                        </div>
                    )}
                    
                    {step === 2 && (
                        <div className={recoverPasswordStyles.form.container}>
                            <div className={recoverPasswordStyles.form.section}>
                                <p>Introduce el código</p>
                                <input 
                                    type="text" 
                                    name="code" 
                                    value={formData.code} 
                                    onChange={handleChange} 
                                    className={inputClassName(errors.code)} 
                                />
                                {errors.code && <p className={recoverPasswordStyles.form.error}>{errors.code}</p>}
                            </div>
                            <div>
                                <p>Introduce tu nueva contraseña</p>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    className={inputClassName(errors.account)} 
                                />
                                {errors.account && <p className={recoverPasswordStyles.form.error}>{errors.account}</p>}
                            </div>
                        </div>
                    )}
                    
                    {step === 3 && (
                        <p>Contraseña cambiada correctamente</p>
                    )}
                    
                    <div className={recoverPasswordStyles.buttons.container}>
                        <button 
                            type="submit" 
                            onClick={handleSubmit} 
                            className={recoverPasswordStyles.buttons.primary}
                        >
                            Enviar
                        </button>
                        <button 
                            onClick={handleRollback} 
                            className={recoverPasswordStyles.buttons.secondary}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}