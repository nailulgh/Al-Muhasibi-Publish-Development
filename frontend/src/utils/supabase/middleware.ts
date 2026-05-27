import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    // Jika terjadi error auth (misalnya token tidak valid/kadaluarsa), hapus cookie stale
    if (error) {
        request.cookies.getAll().forEach((cookie) => {
            if (cookie.name.startsWith('sb-')) {
                supabaseResponse.cookies.delete(cookie.name)
            }
        })
    }

    // Melindungi rute /admin
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        const redirectResponse = NextResponse.redirect(url)
        // Salin cookie (termasuk penghapusan cookie) ke respon pengalihan
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
        })
        return redirectResponse
    }

    // Mengalihkan ke /admin jika sudah login dan mengunjungi /login
    if (request.nextUrl.pathname.startsWith('/login') && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        const redirectResponse = NextResponse.redirect(url)
        // Salin cookie ke respon pengalihan
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
        })
        return redirectResponse
    }

    return supabaseResponse
}
