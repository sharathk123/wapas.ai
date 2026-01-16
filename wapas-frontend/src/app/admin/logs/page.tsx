'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    RefreshCw,
    Loader2,
    Phone,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'

interface Recovery {
    id: string
    created_at: string
    customer_name: string
    customer_phone: string
    status: 'pending' | 'sent' | 'failed'
    cart_value: number
    currency: string
    merchant_id: string
}

export default function AdminLogsPage() {
    const [logs, setLogs] = useState<Recovery[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchLogs = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('recoveries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (!error && data) {
            setLogs(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchLogs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        if (phone.length > 8) {
            return phone.slice(0, 4) + '****' + phone.slice(-4)
        }
        return phone
    }

    const stats = {
        total: logs.length,
        sent: logs.filter(l => l.status === 'sent').length,
        failed: logs.filter(l => l.status === 'failed').length,
        revenue: logs.filter(l => l.status === 'sent').reduce((sum, l) => sum + (l.cart_value || 0), 0),
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">System Logs</h1>
                    <p className="text-slate-400">All recovery attempts across merchants</p>
                </div>
                <Button
                    variant="outline"
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    onClick={fetchLogs}
                    disabled={loading}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Phone className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.total}</p>
                                <p className="text-xs text-slate-400">Total Calls</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.sent}</p>
                                <p className="text-xs text-slate-400">Delivered</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/10">
                                <XCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.failed}</p>
                                <p className="text-xs text-slate-400">Failed</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <span className="text-lg text-purple-400">₹</span>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{stats.revenue.toLocaleString()}</p>
                                <p className="text-xs text-slate-400">Potential Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                    <CardDescription>Last 100 recovery attempts</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="text-center py-12">
                            <Phone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400">No logs yet</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800">
                                    <TableHead className="text-slate-400">Customer</TableHead>
                                    <TableHead className="text-slate-400">Phone</TableHead>
                                    <TableHead className="text-slate-400">Cart Value</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id} className="border-slate-800">
                                        <TableCell className="font-medium text-white">
                                            {log.customer_name || 'Unknown'}
                                        </TableCell>
                                        <TableCell className="text-slate-400 font-mono text-sm">
                                            {formatPhone(log.customer_phone)}
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {log.currency === 'INR' ? '₹' : '$'}{log.cart_value?.toLocaleString() || '0'}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(log.status)}
                                        </TableCell>
                                        <TableCell className="text-slate-500">
                                            {formatDate(log.created_at)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
