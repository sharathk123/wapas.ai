'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, RefreshCw, LogOut } from 'lucide-react'

interface WaitingRoomProps {
    onRefresh: () => void
    isLoading: boolean
}

export function WaitingRoom({ onRefresh, isLoading }: WaitingRoomProps) {
    const supabase = createClient()
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900/80 border-slate-800">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-amber-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Application Under Review</CardTitle>
                    <CardDescription className="text-slate-400 text-base">
                        Our team is verifying your store details. This usually takes 24-48 hours.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-4 text-center">
                        <p className="text-sm text-slate-400">
                            We&apos;ll notify you via email once your application is approved.
                        </p>
                    </div>
                    <Button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        Refresh Status
                    </Button>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

