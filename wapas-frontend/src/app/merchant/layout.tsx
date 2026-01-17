'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Sidebar } from '@/components/Sidebar'
// import { WaitingRoom } from '@/components/WaitingRoom'
// import { AccessDenied } from '@/components/AccessDenied'
import { Loader2 } from 'lucide-react'

interface Merchant {
    id: string
    store_name: string
    approval_status: 'pending' | 'approved' | 'rejected'
    credits_balance: number
    shopify_domain: string | null
    wa_phone_number_id: string | null
}

interface User {
    id: string
    email?: string
    user_metadata?: {
        avatar_url?: string
        full_name?: string
    }
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [user, setUser] = useState<User | null>(null)
    const [merchant, setMerchant] = useState<Merchant | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const fetchMerchantData = useCallback(async (userId: string) => {
        const { data, error } = await supabase
            .from('merchants')
            .select('*')
            .eq('id', userId)
            .single()

        if (error && error.code !== 'PGRST116') {
            console.error('Error fetching merchant:', error)
        }

        return data
    }, [supabase])

    const loadData = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            setUser(user)

            // Fetch merchant data
            const merchantData = await fetchMerchantData(user.id)

            if (merchantData) {
                setMerchant(merchantData)
            } else {
                // Create new merchant record if none exists
                const { data: newMerchant, error } = await supabase
                    .from('merchants')
                    .insert([
                        {
                            id: user.id,
                            store_name: user.user_metadata?.full_name || 'My Store',
                            approval_status: 'pending',
                            credits_balance: 50,
                        }
                    ])
                    .select()
                    .single()

                if (!error && newMerchant) {
                    setMerchant(newMerchant)
                }
            }
        }

        setLoading(false)
    }, [supabase, fetchMerchantData])

    useEffect(() => {
        loadData()
    }, [loadData])



    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        )
    }

    // No merchant record (shouldn't happen, but fallback)
    if (!merchant) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
                <p className="text-slate-400">Setting up your account...</p>
            </div>
        )
    }

    // Simplified: No waiting room, all merchants get access immediately
    // If you need to re-enable gates, uncomment the logic below.

    /*
    // Gatekeeper: Pending status
    if (merchant.approval_status === 'pending') {
        return <WaitingRoom onRefresh={handleRefresh} isLoading={refreshing} />
    }

    // Gatekeeper: Rejected status
    if (merchant.approval_status === 'rejected') {
        return <AccessDenied />
    }
    */

    // Approved: Full dashboard
    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar user={user!} credits={merchant.credits_balance} />
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    )
}
