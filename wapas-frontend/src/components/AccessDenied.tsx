import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, Mail } from 'lucide-react'
import Link from 'next/link'

export function AccessDenied() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950/20 to-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900/80 border-red-900/50">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                        <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                    <CardTitle className="text-2xl text-white">Access Denied</CardTitle>
                    <CardDescription className="text-slate-400 text-base">
                        Your application was not approved at this time.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4 text-center">
                        <p className="text-sm text-red-300">
                            This could be due to incomplete information or verification issues.
                        </p>
                    </div>
                    <Button
                        asChild
                        variant="outline"
                        className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                        <Link href="mailto:support@wapas.ai">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Support
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
