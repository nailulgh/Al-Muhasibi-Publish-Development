'use client'

import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const searchParams = useSearchParams()
    const router = useRouter()
    
    // Initial error message from URL if any
    const initialErrorMessage = searchParams.get('error')

    return (
        <div className="min-h-screen flex items-center justify-center flex-col p-4 relative"
            style={{ backgroundColor: 'var(--background)', fontFamily: 'var(--font-body)' }}>

            {/* Back to Home Button - Pill Style */}
            <div className="absolute top-5 left-5 z-50 md:block">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm no-underline transition-all duration-300 hover:-translate-y-0.5"
                    style={{
                        backgroundColor: 'var(--foreground)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    }}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Halaman Utama</span>
                </Link>
            </div>

            {/* Main Container - Matches the original 768px card */}
            <div
                className="relative overflow-hidden w-full"
                style={{
                    backgroundColor: 'var(--foreground)',
                    borderRadius: '30px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border-color)',
                    maxWidth: '768px',
                    minHeight: '480px',
                }}
            >
                {/* Form Container */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center transition-all duration-600">
                    <form
                        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault()
                            setIsSubmitting(true)
                            setErrorMsg(null)
                            
                            const formData = new FormData(e.currentTarget)
                            const email = formData.get('email') as string
                            const password = formData.get('password') as string
                            
                            const supabase = createClient()
                            const { error } = await supabase.auth.signInWithPassword({
                                email,
                                password,
                            })
                            
                            if (error) {
                                setErrorMsg('Kredensial login tidak valid')
                                setIsSubmitting(false)
                            } else {
                                router.push('/admin')
                                router.refresh()
                            }
                        }}
                        className="flex flex-col items-center justify-center w-full h-full px-10"
                        style={{ backgroundColor: 'var(--foreground)' }}
                    >
                        <h1
                            className="font-bold"
                            style={{
                                fontFamily: 'var(--font-heading)',
                                color: 'var(--text-primary)',
                            }}
                        >
                            Login Admin
                        </h1>

                        <span
                            className="my-2 text-sm"
                            style={{
                                fontSize: '12px',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            Masuk ke dasbor pengelola
                        </span>

                        {/* Error Message */}
                        {(errorMsg || initialErrorMessage) && (
                            <div className="w-full max-w-[420px] bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg my-2 text-center">
                                {errorMsg || initialErrorMessage}
                            </div>
                        )}

                        {/* Email Input */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className="w-full outline-none transition-[border-color] duration-300 focus:border-[var(--accent-olive)]"
                            style={{
                                maxWidth: '420px',
                                backgroundColor: 'var(--background)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                margin: '8px 0',
                                padding: '10px 15px',
                                fontSize: '13px',
                                borderRadius: '8px',
                            }}
                        />

                        {/* Password Input with Toggle */}
                        <div className="relative w-full" style={{ maxWidth: '420px' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                required
                                className="w-full outline-none transition-[border-color] duration-300 focus:border-[var(--accent-olive)]"
                                style={{
                                    backgroundColor: 'var(--background)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    margin: '8px 0',
                                    padding: '10px 15px',
                                    fontSize: '13px',
                                    borderRadius: '8px',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer bg-transparent border-none"
                                style={{ color: '#777' }}
                            >
                                {showPassword ? (
                                    <Eye className="w-4 h-4" />
                                ) : (
                                    <EyeOff className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        <a
                            href="/"
                            className="no-underline transition-colors duration-300 hover:text-[var(--accent-gold)]"
                            style={{
                                color: 'var(--text-secondary)',
                                fontSize: '13px',
                                margin: '15px 0 10px',
                            }}
                        >
                            Lupa Password?
                        </a>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="cursor-pointer uppercase tracking-wider transition-all duration-100 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                backgroundColor: 'var(--accent-gold)',
                                color: 'var(--text-primary)',
                                fontSize: '12px',
                                padding: '10px 45px',
                                border: '1px solid transparent',
                                borderRadius: '8px',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                marginTop: '10px',
                            }}
                        >
                            {isSubmitting ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
