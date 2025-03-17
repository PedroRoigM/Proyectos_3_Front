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
            console.log("Decoded token:", decoded);
            // Redirigir a /dashboard si ya está validado
            if (decoded?.validated && request.nextUrl.pathname.startsWith('/validation')) {
                return NextResponse.rewrite(new URL('/dashboard', request.url));
            }

            // Redirigir a /dashboard si intenta entrar a otro sitio sin ser /validation
            if (!request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/validation')) {
                return NextResponse.rewrite(new URL('/dashboard', request.url));
            }

        } catch (error) {
            console.error("Error decoding token:", error);
            return NextResponse.rewrite(new URL('/', request.url)); // Si el token es inválido, mandar a inicio
        }
    }

    if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.rewrite(new URL('/', request.url));
    }

    return NextResponse.next();
}

// Configuración del middleware
export const config = {
    matcher: ['/:path*'],
};
