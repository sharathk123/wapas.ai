'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins, CreditCard, Check, Zap } from 'lucide-react'

const pricingPlans = [
    {
        name: 'Starter',
        credits: 100,
        price: '₹999',
        pricePerCall: '₹9.99',
        popular: false,
    },
    {
        name: 'Growth',
        credits: 500,
        price: '₹3,999',
        pricePerCall: '₹7.99',
        popular: true,
    },
    {
        name: 'Scale',
        credits: 2000,
        price: '₹11,999',
        pricePerCall: '₹5.99',
        popular: false,
    },
]

export default function BillingPage() {
    const [credits, setCredits] = useState(0)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchCredits = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data } = await supabase
                    .from('merchants')
                    .select('credits_balance')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setCredits(data.credits_balance)
                }
            }

            setLoading(false)
        }

        fetchCredits()
    }, [supabase])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Billing & Credits</h1>
                <p className="text-slate-400">Manage your call credits</p>
            </div>

            {/* Current Balance */}
            <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
                <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-500/20">
                            <Coins className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Current Balance</p>
                            <p className="text-3xl font-bold text-white">
                                {loading ? '...' : credits} <span className="text-lg font-normal text-slate-400">credits</span>
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-indigo-600 text-white px-3 py-1">
                        1 credit = 1 voice call
                    </Badge>
                </CardContent>
            </Card>

            {/* Pricing Plans */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Buy Credits</h2>
                <div className="grid md:grid-cols-3 gap-4">
                    {pricingPlans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={`bg-slate-900/50 border-slate-800 relative ${plan.popular ? 'border-indigo-500 ring-1 ring-indigo-500' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-indigo-600 text-white">
                                        <Zap className="w-3 h-3 mr-1" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}
                            <CardHeader className="text-center pt-6">
                                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                                <CardDescription>{plan.credits} credits</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <div>
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                </div>
                                <p className="text-sm text-slate-400">
                                    {plan.pricePerCall} per call
                                </p>
                                <ul className="text-sm text-slate-400 space-y-2">
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-400" />
                                        {plan.credits} voice calls
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-400" />
                                        11+ Indian languages
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-green-400" />
                                        No expiry
                                    </li>
                                </ul>
                                <Button
                                    className={`w-full ${plan.popular
                                            ? 'bg-indigo-600 hover:bg-indigo-500'
                                            : 'bg-slate-800 hover:bg-slate-700'
                                        }`}
                                >
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Buy Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Usage History Placeholder */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg text-white">Transaction History</CardTitle>
                    <CardDescription>Your credit purchases and usage</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="text-sm text-slate-500">No transactions yet</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
