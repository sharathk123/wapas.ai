'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Phone, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react'

interface Recovery {
    id: string
    created_at: string
    customer_name: string
    customer_phone: string
    status: 'pending' | 'sent' | 'failed'
    cart_value: number
    currency: string
}

export default function LogsPage() {
    const [logs, setLogs] = useState<Recovery[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchLogs = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data } = await supabase
                    .from('recoveries')
                    .select('*')
                    .eq('merchant_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(50)

                if (data) {
                    setLogs(data)
                }
            }

            setLoading(false)
        }

        fetchLogs()
    }, [supabase])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'sent':
                return (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Sent
                    </Badge>
                )
            case 'failed':
                return (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Failed
                    </Badge>
                )
            default:
                return (
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                    </Badge>
                )
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatPhone = (phone: string) => {
        // Mask middle digits for privacy
        if (phone.length > 8) {
            return phone.slice(0, 4) + '****' + phone.slice(-4)
        }
        return phone
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Call Logs</h1>
                <p className="text-slate-400">Recent voice recovery attempts</p>
            </div>

            {/* Logs Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                    <CardDescription>Last 50 recovery attempts</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12">
                            <Phone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No calls logged yet</p>
                            <p className="text-sm text-slate-500 mt-1">
                                Voice notes will appear here once you start recovering carts
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {/* Table Header */}
                            <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs text-slate-500 uppercase tracking-wider">
                                <span>Customer</span>
                                <span>Phone</span>
                                <span>Cart Value</span>
                                <span>Status</span>
                                <span>Time</span>
                            </div>

                            {/* Table Rows */}
                            {logs.map((log) => (
                                <div
                                    key={log.id}
                                    className="grid grid-cols-5 gap-4 px-4 py-3 bg-slate-800/50 rounded-lg items-center"
                                >
                                    <span className="text-sm text-white truncate">
                                        {log.customer_name || 'Unknown'}
                                    </span>
                                    <span className="text-sm text-slate-400 font-mono">
                                        {formatPhone(log.customer_phone)}
                                    </span>
                                    <span className="text-sm text-slate-300">
                                        {log.currency === 'INR' ? '₹' : '$'}{log.cart_value?.toLocaleString() || '0'}
                                    </span>
                                    <span>
                                        {getStatusBadge(log.status)}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {formatDate(log.created_at)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
