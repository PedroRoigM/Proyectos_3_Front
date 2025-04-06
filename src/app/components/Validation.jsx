'use client';
import { useState } from "react";
import { styles } from './styles/components';

export default function Validation({ sendCode }) {
    // codigo de 6 digitos
    const [code, setCode] = useState('');
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setCode(e.target.value);
        setErrors('');
    }

    const handleSubmit = async () => {
        if (!code) {
            setErrors({ code: 'El código es obligatorio' });
            return;
        }
        const response = await sendCode(code);
        console.log(response);
        setErrors(response);
    }

    return (
        <div className={styles.layout.flexCenter}>
            <div className={styles.container.form}>
                <h1 className={styles.headings.h1}>Validar correo</h1>
                <p className={styles.headings.paragraph}>Introduce el código de 6 dígitos que te hemos enviado al correo</p>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <input
                        type="text"
                        value={code}
                        onChange={handleChange}
                        className={`${styles.form.input.base} ${styles.form.input.valid} mb-4`}
                    />
                    <button
                        type="submit"
                        className={styles.buttons.primary}
                    >
                        Validar
                    </button>
                </form>
                {errors.account && <p className={styles.errors.small}>{errors.account}</p>}
            </div>
        </div>
    );
}