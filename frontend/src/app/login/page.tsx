import { Suspense } from 'react'
import { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
    title: 'Login Admin | Al Muhasibi',
    description: 'Halaman login untuk pengelola Asrama Al Muhasibi.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Memuat...</p>
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
