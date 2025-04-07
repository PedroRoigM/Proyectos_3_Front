'use server';
import { redirect } from "next/navigation";
import errorHandler from "../errors/Errors";
export default async function PatchRecoverPassword(formData) {
    try {
        console.log(process.env.SERVER_URL);
        const url = `${process.env.SERVER_URL}/users/recover-password`;
        const body = JSON.stringify({
            email: formData.email,
            code: formData.code,
            password: formData.password,
        });
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: body,
        });
        if (!response.ok) {
            const data = await response.json();
            return errorHandler(data);
        }
        // Llevar al usuario a la página de login
        redirect('/');
        return true;
    } catch (err) {
        return null;
    }

}