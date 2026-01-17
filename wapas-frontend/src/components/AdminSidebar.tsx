'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    LayoutDashboard,
    ShieldCheck,
    LogOut
} from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
            {/* Logo */}
            <div className="p-4 border-b border-slate-800">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-white">Wapas.ai</span>
                        <span className="text-xs text-red-400 ml-2">ADMIN</span>
                    </div>
                </Link>
            </div>

            {/* Admin Badge */}
            <div className="p-4 border-b border-slate-800">
                <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-red-300">Super Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                                isActive
                                    ? 'bg-red-600 text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Quick Link to Merchant Dashboard */}
            <div className="p-4 border-t border-slate-800">
                <Link href="/merchant">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                        View as Merchant →
                    </Button>
                </Link>
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
