'use server';
import { cookies } from "next/headers";
import errorHandler from "../../../components/errors/Errors";

// Mantener un registro de las solicitudes recientes para evitar duplicados
const recentRequests = new Map();

export default async function PostTFG(formData, requestId = null) {
    const uniqueId = requestId || `tfg-${Date.now()}`;

    try {
        console.log(`[${uniqueId}] Iniciando PostTFG`);

        // Verificar si esta es una solicitud duplicada basada en el contenido
        const contentHash = JSON.stringify(formData);
        const recentRequest = recentRequests.get(contentHash);

        if (recentRequest && Date.now() - recentRequest.timestamp < 5000) { // 5 segundos
            console.log(`[${uniqueId}] Detectada solicitud duplicada, usando respuesta en caché`);
            return recentRequest.response;
        }

        const url = `${process.env.SERVER_URL}/tfgs`;
        const token = await cookies().then(c => c.get('bytoken')?.value);

        if (!token) {
            throw new Error('Token not found');
        }

        console.log(`[${uniqueId}] Enviando datos al servidor:`, formData);

        const body = JSON.stringify(formData);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Request-ID': uniqueId, // Añadir ID para seguimiento
            },
            body: body,
            signal: AbortSignal.timeout(15000), // 15 segundos
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error(`[${uniqueId}] Error en respuesta API:`, responseData);
            const errorResult = errorHandler(responseData);
            return errorResult;
        }

        console.log(`[${uniqueId}] TFG creado exitosamente:`, responseData.data);

        // Guardar en caché para evitar duplicados
        recentRequests.set(contentHash, {
            timestamp: Date.now(),
            response: responseData.data
        });

        // Limpiar caché de solicitudes antiguas (más de 10 minutos)
        const now = Date.now();
        for (const [key, value] of recentRequests.entries()) {
            if (now - value.timestamp > 600000) { // 10 minutos
                recentRequests.delete(key);
            }
        }

        return responseData.data;
    } catch (err) {
        console.error(`[${uniqueId}] Error en PostTFG:`, err);
        return {
            error: true,
            message: err.message || "Error al crear el TFG"
        };
    }
}