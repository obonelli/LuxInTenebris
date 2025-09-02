import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        // Admin: sólo SUPERADMIN
        if (pathname.startsWith('/admin')) {
            if (token?.role !== 'SUPERADMIN') {
                const url = new URL('/redirect', req.url);
                url.searchParams.set('to', '/');                 // a dónde enviamos
                url.searchParams.set('reason', 'forbidden');     // motivo
                return NextResponse.redirect(url);
            }
            return;
        }

        // cv-reviewer: requiere sesión
        if (pathname.startsWith('/cv-reviewer')) {
            if (!token) {
                const url = new URL('/redirect', req.url);
                url.searchParams.set('to', '/');                 // o a '/api/auth/signin' si prefieres
                url.searchParams.set('reason', 'signin-required');
                return NextResponse.redirect(url);
            }
        }
    },
    { callbacks: { authorized: () => true } }
);

export const config = {
    matcher: ['/admin/:path*', '/cv-reviewer/:path*'],
};
