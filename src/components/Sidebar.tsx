'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    LayoutDashboard,
    Settings,
    CreditCard,
    FileText,
    LogOut,
    Coins,
    ShieldCheck
} from 'lucide-react'
import { signOut } from '@/app/auth/actions'
import React from 'react'

interface SidebarProps {
    user: {
        id: string
        email?: string
        user_metadata?: {
            avatar_url?: string
            full_name?: string
        }
    }
    credits: number
}

const navItems = [
    { href: '/merchant', label: 'Overview', icon: LayoutDashboard },
    { href: '/merchant/integrations', label: 'Integrations', icon: Settings },
    { href: '/merchant/billing', label: 'Billing', icon: CreditCard },
    { href: '/merchant/logs', label: 'Call Logs', icon: FileText },
]

export function Sidebar({ user, credits }: SidebarProps) {
    const pathname = usePathname()

    const supabase = createClient()

    const handleSignOut = async () => {
        await signOut()
    }

    const initials = user.user_metadata?.full_name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || user.email?.[0].toUpperCase() || '?'

    // Check if user is admin (this is a client-side convenience check, actual protection is in middleware/page)
    const [isAdmin, setIsAdmin] = React.useState(false)

    React.useEffect(() => {
        const checkAdmin = async () => {
            if (user.id) {
                const { data } = await supabase
                    .from('app_admins')
                    .select('id')
                    .eq('id', user.id)
                    .single()
                if (data) setIsAdmin(true)
            }
        }
        checkAdmin()
    }, [user.id, supabase])

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-4 border-b border-slate-800">
                <Link href="/merchant" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">W</span>
                    </div>
                    <span className="text-lg font-bold text-white">Wapas.ai</span>
                </Link>
            </div>

            {/* Admin Switcher */}
            {isAdmin && (
                <div className="p-2 mx-2 mt-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <Link href="/admin">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/20"
                        >
                            <ShieldCheck className="w-4 h-4 mr-2" />
                            Super Admin Console
                        </Button>
                    </Link>
                </div>
            )}

            {/* User Info */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-indigo-600 text-white">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {user.user_metadata?.full_name || user.email}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Coins className="w-3 h-3" />
                            <span>{credits} credits</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/merchant' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Credits Badge */}
            <div className="p-4 border-t border-slate-800">
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Credits Available</span>
                        <Badge variant="secondary" className="bg-indigo-600 text-white">
                            {credits}
                        </Badge>
                    </div>
                    <Link href="/merchant/billing">
                        <Button size="sm" variant="ghost" className="w-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-600/10">
                            Buy More Credits
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Sign Out */}
            <div className="p-4 border-t border-slate-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                </Button>
            </div>
        </aside>
    )
}
