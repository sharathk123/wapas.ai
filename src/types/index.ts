export interface Merchant {
    id: string
    created_at: string
    store_name: string
    approval_status: 'pending' | 'approved' | 'rejected'
    is_active: boolean
    credits_balance: number
    shopify_domain: string | null
}

export interface Recovery {
    id: string
    created_at: string
    customer_name: string
    customer_phone: string
    status: 'pending' | 'sent' | 'failed'
    cart_value: number
    currency: string
    merchant_id: string
}

export interface MerchantStats {
    total_carts: number
    calls_made: number
    potential_revenue: number
    failed_calls: number
}
