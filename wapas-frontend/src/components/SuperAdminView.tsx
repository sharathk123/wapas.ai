'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    MoreHorizontal,
    CheckCircle,
    XCircle,
    Ban,
    Coins,
    Loader2,
    RefreshCw,
    Users,
    Phone,
    Clock
} from 'lucide-react'
import { Merchant, Recovery } from '@/types'

export default function SuperAdminView() {

    // Logs State
    const [logs, setLogs] = useState<Recovery[]>([])
    const [logsLoading, setLogsLoading] = useState(false)

    // Merchants State
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
    const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)

    const supabase = createClient()

    const fetchMerchants = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('merchants')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setMerchants(data)
        }
        setLoading(false)
    }, [supabase])

    const fetchLogs = useCallback(async () => {
        setLogsLoading(true)
        const { data, error } = await supabase
            .from('recoveries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (!error && data) {
            setLogs(data)
        }
        setLogsLoading(false)
    }, [supabase])

    useEffect(() => {
        fetchMerchants()
        fetchLogs()
    }, [fetchMerchants, fetchLogs])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatPhone = (phone: string) => {
        if (phone.length > 8) {
            return phone.slice(0, 4) + '****' + phone.slice(-4)
        }
        return phone
    }

    const handleApprove = async (merchant: Merchant) => {
        setActionLoading(merchant.id)
        const { error } = await supabase
            .from('merchants')
            .update({ approval_status: 'approved', is_active: true })
            .eq('id', merchant.id)

        if (!error) {
            fetchMerchants()
        }
        setActionLoading(null)
    }

    const handleReject = async (merchant: Merchant) => {
        setActionLoading(merchant.id)
        const { error } = await supabase
            .from('merchants')
            .update({ approval_status: 'rejected', is_active: false })
            .eq('id', merchant.id)

        if (!error) {
            fetchMerchants()
        }
        setActionLoading(null)
    }

    const handleSuspend = async (merchant: Merchant) => {
        setActionLoading(merchant.id)
        const { error } = await supabase
            .from('merchants')
            .update({ is_active: !merchant.is_active })
            .eq('id', merchant.id)

        if (!error) {
            fetchMerchants()
        }
        setActionLoading(null)
    }

    const handleAddCredits = async () => {
        if (!selectedMerchant) return

        setActionLoading(selectedMerchant.id)
        const { error } = await supabase
            .from('merchants')
            .update({ credits_balance: (selectedMerchant.credits_balance || 0) + 50 })
            .eq('id', selectedMerchant.id)

        if (!error) {
            fetchMerchants()
            setCreditsDialogOpen(false)
        }
        setActionLoading(null)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                    </Badge>
                )
            case 'rejected':
                return (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
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

    const getLogStatusBadge = (status: string) => {
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

    const logsStats = {
        total: logs.length,
        sent: logs.filter(l => l.status === 'sent').length,
        failed: logs.filter(l => l.status === 'failed').length,
        revenue: logs.filter(l => l.status === 'sent').reduce((sum, l) => sum + (l.cart_value || 0), 0),
    }

    return (
        <div className="space-y-8 mb-10 border-b border-slate-800 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Super Admin Console</h1>
                    <p className="text-slate-400">Platform-wide management and system logs</p>
                </div>
                <Button
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    onClick={() => {
                        fetchMerchants()
                        fetchLogs()
                    }}
                    disabled={loading || logsLoading}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${(loading || logsLoading) ? 'animate-spin' : ''}`} />
                    Refresh Platform Data
                </Button>
            </div>

            {/* Combined Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10">
                                <Users className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{merchants.length}</p>
                                <p className="text-xs text-slate-400">Total Merchants</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-500/10">
                                <Loader2 className="w-5 h-5 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {merchants.filter(m => m.approval_status === 'pending').length}
                                </p>
                                <p className="text-xs text-slate-400">Pending Approvals</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-500/10">
                                <Phone className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {logsStats.sent}
                                </p>
                                <p className="text-xs text-slate-400">Active Recoveries</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Coins className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">₹{logsStats.revenue.toLocaleString()}</p>
                                <p className="text-xs text-slate-400">Total Revenue</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Merchant Management Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Merchant Management</h2>
                </div>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                            </div>
                        ) : merchants.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No merchants yet</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-slate-900/50">
                                        <TableHead className="text-slate-400 pl-6">Store</TableHead>
                                        <TableHead className="text-slate-400">Domain</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                        <TableHead className="text-slate-400">Active</TableHead>
                                        <TableHead className="text-slate-400">Credits</TableHead>
                                        <TableHead className="text-slate-400">Joined</TableHead>
                                        <TableHead className="text-slate-400 text-right pr-6">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {merchants.map((merchant) => (
                                        <TableRow key={merchant.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                                            <TableCell className="font-medium text-white pl-6">
                                                {merchant.store_name}
                                            </TableCell>
                                            <TableCell className="text-slate-400 font-mono text-sm">
                                                {merchant.shopify_domain || '—'}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(merchant.approval_status)}
                                            </TableCell>
                                            <TableCell>
                                                <Switch
                                                    checked={merchant.is_active}
                                                    onCheckedChange={() => handleSuspend(merchant)}
                                                    disabled={actionLoading === merchant.id}
                                                />
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {merchant.credits_balance}
                                            </TableCell>
                                            <TableCell className="text-slate-500">
                                                {formatDate(merchant.created_at)}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            disabled={actionLoading === merchant.id}
                                                        >
                                                            {actionLoading === merchant.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                                                        <DropdownMenuLabel className="text-slate-400">Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator className="bg-slate-800" />
                                                        <DropdownMenuItem
                                                            className="text-green-400 focus:text-green-300 focus:bg-green-500/10"
                                                            onClick={() => handleApprove(merchant)}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" />
                                                            Approve
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-400 focus:text-red-300 focus:bg-red-500/10"
                                                            onClick={() => handleReject(merchant)}
                                                        >
                                                            <XCircle className="w-4 h-4 mr-2" />
                                                            Reject
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-amber-400 focus:text-amber-300 focus:bg-amber-500/10"
                                                            onClick={() => handleSuspend(merchant)}
                                                        >
                                                            <Ban className="w-4 h-4 mr-2" />
                                                            {merchant.is_active ? 'Suspend' : 'Unsuspend'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator className="bg-slate-800" />
                                                        <DropdownMenuItem
                                                            className="text-indigo-400 focus:text-indigo-300 focus:bg-indigo-500/10"
                                                            onClick={() => {
                                                                setSelectedMerchant(merchant)
                                                                setCreditsDialogOpen(true)
                                                            }}
                                                        >
                                                            <Coins className="w-4 h-4 mr-2" />
                                                            Add 50 Credits
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* System Activity Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Recent System Activity</h2>
                    <Badge variant="outline" className="text-slate-400 border-slate-700">
                        {logsStats.total} Recovery Calls
                    </Badge>
                </div>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-0">
                        {logsLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                            </div>
                        ) : logs.length === 0 ? (
                            <div className="text-center py-12">
                                <Phone className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No activity logs yet</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-slate-900/50">
                                        <TableHead className="text-slate-400 pl-6">Customer</TableHead>
                                        <TableHead className="text-slate-400">Phone</TableHead>
                                        <TableHead className="text-slate-400">Cart Value</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                        <TableHead className="text-slate-400 text-right pr-6">Time</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                                            <TableCell className="font-medium text-white pl-6">
                                                {log.customer_name || 'Unknown'}
                                            </TableCell>
                                            <TableCell className="text-slate-400 font-mono text-sm">
                                                {formatPhone(log.customer_phone)}
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {log.currency === 'INR' ? '₹' : '$'}{log.cart_value?.toLocaleString() || '0'}
                                            </TableCell>
                                            <TableCell>
                                                {getLogStatusBadge(log.status)}
                                            </TableCell>
                                            <TableCell className="text-slate-500 text-right pr-6">
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

            {/* Add Credits Dialog */}
            <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
                {/* ... (existing dialog content) ... */}
                <DialogContent className="bg-slate-900 border-slate-800">
                    <DialogHeader>
                        <DialogTitle className="text-white">Add Credits</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Add 50 credits to {selectedMerchant?.store_name}?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-slate-400">
                            Current balance: <span className="text-white font-medium">{selectedMerchant?.credits_balance}</span>
                        </p>
                        <p className="text-sm text-slate-400">
                            New balance: <span className="text-green-400 font-medium">{(selectedMerchant?.credits_balance || 0) + 50}</span>
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            className="border-slate-700"
                            onClick={() => setCreditsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-indigo-600 hover:bg-indigo-500"
                            onClick={handleAddCredits}
                            disabled={actionLoading === selectedMerchant?.id}
                        >
                            {actionLoading === selectedMerchant?.id ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Coins className="w-4 h-4 mr-2" />
                            )}
                            Add Credits
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
