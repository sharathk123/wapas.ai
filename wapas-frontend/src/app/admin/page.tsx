'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    Users
} from 'lucide-react'

interface Merchant {
    id: string
    created_at: string
    store_name: string
    approval_status: 'pending' | 'approved' | 'rejected'
    is_active: boolean
    credits_balance: number
    shopify_domain: string | null
}

export default function AdminMerchantsPage() {
    const [merchants, setMerchants] = useState<Merchant[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [creditsDialogOpen, setCreditsDialogOpen] = useState(false)
    const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null)
    const supabase = createClient()

    const fetchMerchants = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('merchants')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setMerchants(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMerchants()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const updateMerchant = async (id: string, updates: Partial<Merchant>) => {
        setActionLoading(id)
        const { error } = await supabase
            .from('merchants')
            .update(updates)
            .eq('id', id)

        if (!error) {
            // Refresh the list
            await fetchMerchants()
        }
        setActionLoading(null)
    }

    const handleApprove = async (merchant: Merchant) => {
        await updateMerchant(merchant.id, {
            approval_status: 'approved',
            is_active: true,
        })
    }

    const handleReject = async (merchant: Merchant) => {
        await updateMerchant(merchant.id, {
            approval_status: 'rejected',
            is_active: false,
        })
    }

    const handleSuspend = async (merchant: Merchant) => {
        await updateMerchant(merchant.id, {
            is_active: !merchant.is_active,
        })
    }

    const handleAddCredits = async () => {
        if (!selectedMerchant) return

        await updateMerchant(selectedMerchant.id, {
            credits_balance: selectedMerchant.credits_balance + 50,
        })
        setCreditsDialogOpen(false)
        setSelectedMerchant(null)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500/10 text-green-400 border-green-500/30">Approved</Badge>
            case 'rejected':
                return <Badge className="bg-red-500/10 text-red-400 border-red-500/30">Rejected</Badge>
            default:
                return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30">Pending</Badge>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Merchant Management</h1>
                    <p className="text-slate-400">Approve, reject, or manage merchant accounts</p>
                </div>
                <Button
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
                    onClick={fetchMerchants}
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
                                <p className="text-xs text-slate-400">Pending</p>
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
                                <p className="text-2xl font-bold text-white">
                                    {merchants.filter(m => m.approval_status === 'approved').length}
                                </p>
                                <p className="text-xs text-slate-400">Approved</p>
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
                                <p className="text-2xl font-bold text-white">
                                    {merchants.filter(m => m.approval_status === 'rejected').length}
                                </p>
                                <p className="text-xs text-slate-400">Rejected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">All Merchants</CardTitle>
                    <CardDescription>Click actions menu to manage each merchant</CardDescription>
                </CardHeader>
                <CardContent>
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
                                <TableRow className="border-slate-800">
                                    <TableHead className="text-slate-400">Store</TableHead>
                                    <TableHead className="text-slate-400">Domain</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400">Active</TableHead>
                                    <TableHead className="text-slate-400">Credits</TableHead>
                                    <TableHead className="text-slate-400">Joined</TableHead>
                                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {merchants.map((merchant) => (
                                    <TableRow key={merchant.id} className="border-slate-800">
                                        <TableCell className="font-medium text-white">
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
                                        <TableCell className="text-right">
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

            {/* Add Credits Dialog */}
            <Dialog open={creditsDialogOpen} onOpenChange={setCreditsDialogOpen}>
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
