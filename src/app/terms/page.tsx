import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
            {/* Header */}
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <span className="font-bold text-lg">Wapas.ai</span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
                <p className="text-slate-400 mb-8">Last updated: January 17, 2026</p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="leading-relaxed">
                            By accessing or using Wapas.ai ("the Service"), you agree to be bound by these Terms of Service.
                            If you disagree with any part of the terms, you may not access the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="leading-relaxed">
                            Wapas.ai provides an automated abandoned cart recovery solution for Shopify merchants using WhatsApp.
                            We facilitate the generation of audio messages and text notifications to recover lost sales.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
                        <p className="leading-relaxed">
                            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. WhatsApp Policy Compliance</h2>
                        <p className="leading-relaxed">
                            You agree to comply with all applicable WhatsApp Business Policies. You are responsible for obtaining necessary opt-ins
                            from your customers before sending messages via our platform. Wapas.ai represents a tool for communication but legal compliance
                            regarding consumer data and messaging rests with the merchant.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Payments and Refunds</h2>
                        <p className="leading-relaxed">
                            Start-up credits are provided upon registration. Additional credits must be purchased to continue using the service.
                            Payments are non-refundable unless otherwise required by law or specified in our specific refund policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
                        <p className="leading-relaxed">
                            In no event shall Wapas.ai, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect,
                            incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
                        <p className="leading-relaxed">
                            We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever,
                            including without limitation if you breach the Terms.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-slate-800">
                        <p className="text-slate-400">
                            Questions? Contact us at <a href="mailto:support@wapas.ai" className="text-indigo-400 hover:underline">support@wapas.ai</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
