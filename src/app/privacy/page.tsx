import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
                <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
                <p className="text-slate-400 mb-8">Last updated: January 17, 2026</p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2 text-slate-300">
                            <li><strong>Account Information:</strong> When you sign up, we collect your name, email address, and authentication details (via Google/Supabase).</li>
                            <li><strong>Merchant Data:</strong> We process data related to your Shopify store, specifically abandoned checkout details (customer phone numbers, names, cart value) to facilitate message delivery.</li>
                            <li><strong>Usage Data:</strong> We collect metrics on how you use the dashboard to improve our services.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="leading-relaxed">
                            We use the collected data to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-300">
                            <li>Provide and maintain the Service (generating audio and sending WhatsApp messages).</li>
                            <li>Notify you about changes to our Service.</li>
                            <li>Provide customer support.</li>
                            <li>Monitor the usage of the Service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Retention</h2>
                        <p className="leading-relaxed">
                            We retain your personal data and your customers' data only for as long as is necessary for the purposes set out in this Privacy Policy.
                            We will retain and use your data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h2>
                        <p className="leading-relaxed">
                            We use trusted third-party services to operate Wapas.ai:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-300">
                            <li><strong>Supabase:</strong> For authentication and database hosting.</li>
                            <li><strong>Sarvam AI:</strong> For text-to-speech generation.</li>
                            <li><strong>Meta (WhatsApp):</strong> For message delivery.</li>
                            <li><strong>Google Analytics:</strong> For analyzing website traffic.</li>
                        </ul>
                        <p className="mt-2 text-slate-400 text-sm">
                            These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Security of Data</h2>
                        <p className="leading-relaxed">
                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
                            While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-slate-800">
                        <p className="text-slate-400">
                            Contact us regarding privacy at <a href="mailto:privacy@wapas.ai" className="text-indigo-400 hover:underline">privacy@wapas.ai</a>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
