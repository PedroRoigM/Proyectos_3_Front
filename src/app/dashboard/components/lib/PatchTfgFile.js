'use server';
import { cookies } from "next/headers";

export default async function PatchTfgFile(id, file) {
    try {
        const url = `${process.env.SERVER_URL}/tfgs/file/${id}`;
        const token = cookies().get('bytoken')?.value;
        if (!token) {
            throw new Error('NOT_FOUND_TOKEN');
        }

        // Crear el FormData
        const body = new FormData();
        body.append('file', file);

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body
        });

        if (!response.ok) {
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (_) { /* Si no se puede parsear JSON, usa statusText */ }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (err) {
        console.error("Error en PatchTfgFile:", err.message);
        return { error: err.message };
    }
}
