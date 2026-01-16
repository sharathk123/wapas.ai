'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Store, Phone, Key, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function IntegrationPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')
    const supabase = createClient()

    const [formData, setFormData] = useState({
        store_name: '',
        shopify_domain: '',
        shopify_access_token: '',
        wa_phone_number_id: '',
    })

    useEffect(() => {
        const fetchMerchant = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                const { data } = await supabase
                    .from('merchants')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (data) {
                    setFormData({
                        store_name: data.store_name || '',
                        shopify_domain: data.shopify_domain || '',
                        shopify_access_token: data.shopify_access_token || '',
                        wa_phone_number_id: data.wa_phone_number_id || '',
                    })
                }
            }

            setLoading(false)
        }

        fetchMerchant()
    }, [supabase])

    const handleSave = async () => {
        setSaving(true)
        setError('')
        setSaved(false)

        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error: updateError } = await supabase
                .from('merchants')
                .update({
                    store_name: formData.store_name,
                    shopify_domain: formData.shopify_domain,
                    shopify_access_token: formData.shopify_access_token,
                    wa_phone_number_id: formData.wa_phone_number_id,
                })
                .eq('id', user.id)

            if (updateError) {
                setError('Failed to save credentials')
            } else {
                setSaved(true)
                setTimeout(() => setSaved(false), 3000)
            }
        }

        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Integration Settings</h1>
                <p className="text-slate-400">Connect your Shopify store and WhatsApp</p>
            </div>

            {/* Shopify Settings */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <Store className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-white">Shopify Connection</CardTitle>
                            <CardDescription>Connect your Shopify store</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Store Name</label>
                        <Input
                            placeholder="My Awesome Store"
                            value={formData.store_name}
                            onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Shopify Domain</label>
                        <Input
                            placeholder="your-store.myshopify.com"
                            value={formData.shopify_domain}
                            onChange={(e) => setFormData({ ...formData, shopify_domain: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Access Token</label>
                        <Input
                            type="password"
                            placeholder="shpat_xxxxxxxxxxxxxxxx"
                            value={formData.shopify_access_token}
                            onChange={(e) => setFormData({ ...formData, shopify_access_token: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                        <p className="text-xs text-slate-500">
                            Get this from your Shopify Admin &gt; Settings &gt; Apps &gt; Develop apps
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* WhatsApp Settings */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <Phone className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-white">WhatsApp Configuration</CardTitle>
                            <CardDescription>Your WhatsApp Business API details</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Phone Number ID</label>
                        <Input
                            placeholder="1234567890123456"
                            value={formData.wa_phone_number_id}
                            onChange={(e) => setFormData({ ...formData, wa_phone_number_id: e.target.value })}
                            className="bg-slate-800 border-slate-700 text-white"
                        />
                        <p className="text-xs text-slate-500">
                            Find this in your Meta Business Suite &gt; WhatsApp &gt; API Setup
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Webhook Info */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10">
                            <Key className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-white">Webhook URL</CardTitle>
                            <CardDescription>Add this URL in your Shopify webhooks</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm text-slate-300 break-all">
                        https://wapas-backend-live.onrender.com/webhooks/shopify/checkout-update
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Event: <Badge variant="outline" className="ml-1 border-slate-600">checkouts/update</Badge>
                    </p>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex items-center gap-4">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-indigo-600 hover:bg-indigo-500"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Credentials'
                    )}
                </Button>

                {saved && (
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        Saved successfully
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}
            </div>
        </div>
    )
}
