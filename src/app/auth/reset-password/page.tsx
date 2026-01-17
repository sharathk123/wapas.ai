'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Check if user came from a valid reset link
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const type = hashParams.get('type')

        if (type === 'recovery' && accessToken) {
            supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: hashParams.get('refresh_token') || '',
            })
        }
    }, [supabase])

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        })

        if (updateError) {
            setError(updateError.message)
        } else {
            setSuccess(true)
            setTimeout(() => router.push('/dashboard'), 2000)
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center px-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
            </div>

            <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-sm border-slate-800 relative z-10">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                        <KeyRound className="w-6 h-6 text-indigo-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Reset Password</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center py-4">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                            <p className="text-white font-medium">Password updated!</p>
                            <p className="text-sm text-slate-400 mt-1">Redirecting to dashboard...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-slate-400">Confirm Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-slate-800 border-slate-700 text-white"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-400">{error}</p>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Password'
                                )}
                            </Button>

                            <p className="text-center text-sm text-slate-500">
                                <Link href="/login" className="text-indigo-400 hover:underline">
                                    Back to Login
                                </Link>
                            </p>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
