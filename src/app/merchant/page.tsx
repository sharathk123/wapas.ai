'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, DollarSign, Phone, TrendingUp } from 'lucide-react'

import { MerchantStats } from '@/types'



export default function DashboardOverview() {
    const [stats, setStats] = useState<MerchantStats | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchStats = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data, error } = await supabase
                    .from('merchant_stats')
                    .select('*')
                    .eq('merchant_id', user.id)
                    .single()

                if (!error && data) {
                    setStats(data)
                }
            }

            setLoading(false)
        }

        fetchStats()
    }, [supabase])

    const statCards = [
        {
            title: 'Total Carts',
            value: stats?.total_carts || 0,
            description: 'Abandoned carts tracked',
            icon: ShoppingCart,
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'Calls Made',
            value: stats?.calls_made || 0,
            description: 'Voice notes sent',
            icon: Phone,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'Potential Revenue',
            value: `₹${(stats?.potential_revenue || 0).toLocaleString()}`,
            description: 'Cart value recovered',
            icon: DollarSign,
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/10',
        },
        {
            title: 'Success Rate',
            value: stats?.calls_made
                ? `${Math.round(((stats.calls_made - (stats.failed_calls || 0)) / stats.calls_made) * 100)}%`
                : '0%',
            description: 'Delivery success',
            icon: TrendingUp,
            color: 'text-amber-400',
            bgColor: 'bg-amber-500/10',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-slate-400">Track your cart recovery performance</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-400">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-white">
                                    {loading ? '...' : stat.value}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Quick Setup</CardTitle>
                        <CardDescription>Complete your integration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <span className="text-sm text-slate-300">Shopify Connection</span>
                            <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                                Pending
                            </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <span className="text-sm text-slate-300">WhatsApp Setup</span>
                            <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                                Pending
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
                        <CardDescription>Latest recovery attempts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-sm text-slate-500">Loading...</p>
                        ) : stats?.calls_made === 0 ? (
                            <div className="text-center py-6">
                                <Phone className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">No calls made yet</p>
                                <p className="text-xs text-slate-600">Complete your integration to start</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-400">
                                {stats?.calls_made} voice notes sent
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}
