import { NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';
export function middleware(request) {
    const token = request.cookies.get('bytoken')?.value;
    if (request.nextUrl.pathname.startsWith("/_next")) {
        return NextResponse.next();
    }
    if (token) {
        try {
            // Decodificar el token (ajusta tu clave secreta si es JWT)
            const decoded = jwt.decode(token);
            if (decoded?.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
                const response = NextResponse.redirect(new URL('/', request.url));
                response.cookies.delete('bytoken'); // Eliminar cookie
                return response;
            }
            // Redirigir a /dashboard si ya está validado
            if (decoded?.verified && request.nextUrl.pathname.startsWith('/validation')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // Redirigir a /dashboard si intenta entrar a otro sitio sin ser /validation
            if (!request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/validation')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

        } catch (error) {
            console.error("Error decoding token:", error);
            return NextResponse.redirect(new URL('/', request.url)); // Si el token es inválido, mandar a inicio
        }
    }

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Configuración del middleware
export const config = {
    matcher: ['/:path*'],
};
