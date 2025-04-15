'use server';
import { cookies } from "next/headers";

export default async function PatchTfgFile(id, file) {
    try {
        console.log("ID:", id);
        const url = `${process.env.SERVER_URL}/tfgs/pdf/${id}`;
        const token = await cookies().then(c => c.get('bytoken')?.value);
        if (!token) {
            throw new Error('NOT_FOUND_TOKEN');
        }

        // Crear el FormData
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) {
            const data = await response.json();
            return errorHandler(data)
        }

        return await response.json();
    } catch (err) {
        console.error("Error en PatchTfgFile:", err.message);
        return { error: err.message };
    }
}
