import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — Elevate Coders',
  description: 'Privacy Policy and data protection commitments for Elevate Coders families.',
}

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '60px 0 80px', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container-app" style={{ maxWidth: '800px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--brand-purple)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card" style={{ padding: '40px 36px', background: 'var(--bg-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="var(--brand-purple)" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, margin: 0 }}>
                Privacy Policy
              </h1>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Elevate Coders — Effective Date: August 22, 2026
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

          <div style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <p>
              Elevate Coders (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting the privacy of the families we serve. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our website and registration platform. By registering your child for our programs, you consent to the data practices described in this policy.
            </p>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                1. Information We Collect
              </h2>
              <p>To provide a streamlined registration process and ensure student safety, we collect the following information directly from parents or legal guardians:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Parent/Guardian Information:</strong> Full legal name, primary email address, and primary billing phone number.</li>
                <li><strong>Student Information:</strong> Full name, age, selected camp tracks, and specific attendance weeks.</li>
                <li><strong>Health and Safety Information:</strong> Food allergies, medical needs, or special accommodations.</li>
                <li><strong>Marketing &amp; Referral Data:</strong> Referral link tracking codes and promotional codes utilized at checkout.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                2. Children’s Online Privacy Protection Act (COPPA) Compliance
              </h2>
              <p>
                Elevate Coders strictly complies with the Children’s Online Privacy Protection Act (COPPA). We never knowingly collect or solicit personal information directly from children under the age of 13. All student demographic data, names, and health accommodations must be provided exclusively by a parent or legal guardian. Student records are used strictly for internal camp operations, physical safety, and roster verification.
              </p>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                3. How We Use Your Information
              </h2>
              <p>We use the collected data to automate our business operations and grow our community safely:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>To populate classroom attendance rosters and emergency contact sheets.</li>
                <li>To generate view-only, secure sign-in/sign-out sheets for authorized camp staff.</li>
                <li>To manage customer relationships, share program updates, track referral bonuses, and distribute future class discounts.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                4. Third-Party Data Sharing &amp; Financial Processing
              </h2>
              <p>To maintain zero manual operational overhead, your data is securely piped to verified third-party services:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Financial Processing (Gusto &amp; Melio):</strong> We do not collect, process, or store credit card numbers or bank routing data directly on our servers. Your legal billing name, email, phone, and calculated line items are securely transferred via an API webhook to Gusto/Melio to issue official invoices.</li>
                <li><strong>No Data Selling:</strong> We do not sell, rent, trade, or share your or your child&apos;s personal data with outside marketing corporations or third-party advertisers.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                5. Data Security &amp; Access Control
              </h2>
              <p>We implement strict operational security measures:</p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Financial and administrative data is restricted to verified administrators.</li>
                <li>Operational student data (names and emergency contacts) is accessible to instructional assistants via a secure, password/PIN-protected portal that completely strips away private financial details and parent billing records.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                6. Your Rights &amp; Opt-Outs
              </h2>
              <p>
                Parents retain full rights over their family&apos;s data. You may contact us at any time to review, update, or request the deletion of your family&apos;s personal information, or to opt-out of marketing and promotional update emails.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
