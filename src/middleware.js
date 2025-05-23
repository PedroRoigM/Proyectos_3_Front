import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
    const token = request.cookies.get('bytoken')?.value;

    // Permitir recursos estáticos y Next.js
    if (request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/public")) {
        return NextResponse.next();
    }

    if (token) {
        try {
            // Decodificar el token
            const decoded = jwt.decode(token);

            // Verificar si el token ha expirado
            if (decoded?.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
                const response = NextResponse.redirect(new URL('/', request.url));
                response.cookies.delete('bytoken');
                return response;
            }

            // Redirigir a /dashboard si ya está validado y está intentando acceder a páginas de login
            if (decoded?.verified &&
                (request.nextUrl.pathname === '/' ||
                    request.nextUrl.pathname === '/validation' ||
                    request.nextUrl.pathname === '/recover-password')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }

            // Redirigir a /validation si no está validado y no está en /validation
            if (!decoded?.verified && request.nextUrl.pathname !== '/validation') {
                return NextResponse.redirect(new URL('/validation', request.url));
            }

            // Control de acceso por roles
            const userRole = decoded?.role || 'usuario';
            // Restricciones de acceso para rutas administrativas
            if (request.nextUrl.pathname.includes('/admin')) {
                // Solo admins pueden acceder a rutas /admin
                if (userRole !== 'administrador') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            }

            // Rutas para verificación de TFGs (para coordinadores y admins)
            if (request.nextUrl.pathname.includes('/admin') ||
                request.nextUrl.pathname.includes('/verify')) {
                if (userRole !== 'coordinador' && userRole !== 'administrador') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            }

            // Acceso a control-panel solo para administradores
            if (request.nextUrl.pathname.includes('/control-panel')
                || request.nextUrl.pathname.includes('/roles')) {
                if (userRole !== 'administrador') {
                    return NextResponse.redirect(new URL('/dashboard', request.url));
                }
            }

            // Redirigir a /dashboard/admin/tfg si es coordinador o administrador y está intentando acceder a /dashboard/tfg
            if ((userRole === 'coordinador' || userRole === 'administrador') &&
                request.nextUrl.pathname.startsWith('/dashboard/tfg')) {
                const id = request.nextUrl.searchParams.get('id');
                return NextResponse.redirect(new URL(`/dashboard/admin/tfg/${id}?id=${id}`, request.url));
            }

        } catch (error) {
            console.error("Error decodificando token:", error);
            // Si hay un error con el token, redirigir a la página de inicio
            const response = NextResponse.redirect(new URL('/', request.url));
            response.cookies.delete('bytoken');
            return response;
        }
    } else {
        // Si no hay token y está intentando acceder a rutas protegidas
        if (request.nextUrl.pathname.startsWith('/dashboard') ||
            request.nextUrl.pathname === '/validation' ||
            request.nextUrl.pathname.startsWith('/admin') ||
            request.nextUrl.pathname.startsWith('/coordinador') ||
            request.nextUrl.pathname.includes('/search/admin') ||
            request.nextUrl.pathname.includes('/verify')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

// Configuración del middleware para aplicarlo a todas las rutas
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};