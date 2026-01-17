'use client'

import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                router.push('/merchant')
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase, router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">W</span>
                        </div>
                        <span className="text-2xl font-bold text-white">Wapas.ai</span>
                    </Link>
                    <p className="text-slate-400 mt-4">
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#6366f1',
                                        brandAccent: '#4f46e5',
                                        inputBackground: '#1e293b',
                                        inputBorder: '#334155',
                                        inputText: '#f1f5f9',
                                        inputPlaceholder: '#64748b',
                                    },
                                    borderWidths: {
                                        buttonBorderWidth: '1px',
                                        inputBorderWidth: '1px',
                                    },
                                    radii: {
                                        borderRadiusButton: '8px',
                                        buttonBorderRadius: '8px',
                                        inputBorderRadius: '8px',
                                    },
                                },
                            },
                            className: {
                                container: 'auth-container',
                                button: 'auth-button',
                                input: 'auth-input',
                            },
                        }}
                        theme="dark"
                        providers={['google']}
                        redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined}
                        localization={{
                            variables: {
                                sign_in: {
                                    email_label: 'Email Address',
                                    password_label: 'Password',
                                    button_label: 'Sign In',
                                    link_text: "Don't have an account? Sign up",
                                },
                                sign_up: {
                                    email_label: 'Email Address',
                                    password_label: 'Create Password',
                                    button_label: 'Create Account',
                                    link_text: 'Already have an account? Sign in',
                                },
                            },
                        }}
                    />
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-slate-500 mt-6">
                    By signing in, you agree to our{' '}
                    <Link href="#" className="text-indigo-400 hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="#" className="text-indigo-400 hover:underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    )
}
