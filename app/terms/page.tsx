import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Use & Camp Policies — Elevate Coders',
  description: 'Terms of Use, Camp Policies, Physical Liability Waiver, and Refund Policies for Elevate Coders.',
}

export default function TermsAndPoliciesPage() {
  return (
    <div style={{ background: 'var(--bg-base)', padding: '60px 0 80px', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container-app" style={{ maxWidth: '800px' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--brand-purple)', textDecoration: 'none', marginBottom: '24px', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="card" style={{ padding: '40px 36px', background: 'var(--bg-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color="var(--brand-purple)" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, margin: 0 }}>
                Terms of Use &amp; Camp Policies
              </h1>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Elevate Coders — Effective Date: August 22, 2026
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '24px 0' }} />

          <div style={{ color: 'var(--text-primary)', fontSize: '15px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <p>
              Please read these Terms of Use and Camp Policies (&quot;Terms&quot;) carefully before completing your registration. By checking the agreement box and submitting your registration form, you agree to be legally bound by these Terms.
            </p>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                1. Registration &amp; Enrollment Prerequisites
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Prerequisite Verification:</strong> Registration for Level 2 or continuing tracks requires the student to have successfully completed the baseline Beginners Course or possess verified outside coding experience.</li>
                <li><strong>Enrollment Review:</strong> Elevate Coders reserves the right to review all registrations against internal student data histories. Registrations found to violate prerequisite requirements without equivalent experience may be flagged or canceled.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                2. Attendance &amp; Multi-Track Cohorts
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Roster Selection:</strong> Parents must explicitly choose between Track A (Co-Ed Coding Programs) and Track B (All-Girls Coding Programs). These tracks share identical technical curriculums but operate on distinct, independent rosters to build diverse community spaces.</li>
                <li><strong>Cumulative Curriculum:</strong> Our programming is structured week-by-week. Regular attendance is highly encouraged to ensure your child stays up to date with core technical milestones.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                3. Dynamic Vacation Tracking &amp; Prorated Billing
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Vacation Submissions:</strong> Parents may use the built-in scheduling matrix during checkout to log planned travel dates.</li>
                <li><strong>Proration Adjustments:</strong> When vacation toggles are applied, the application automatically computes a prorated balance that modifies the final financial payload sent to our invoicing processor. Adjustments cannot be made retroactively once an invoice is locked.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                4. Invoicing, Payments, and Discounts
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Automated Gusto Invoices:</strong> Upon submitting the registration form, an automated data payload triggers an invoice via Gusto/Melio set to &quot;Due Immediately.&quot;</li>
                <li><strong>Payment Enforcement:</strong> Payment options are restricted to your selected preference (ACH Only or ACH + Credit Card). Unpaid invoices may result in the forfeiture of your child’s seat on the classroom roster.</li>
                <li><strong>Discount Code Policy:</strong> Promotional discounts (such as corporate partner codes) must be applied at the time of submission.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                5. &quot;Bring-a-Friend&quot; Referral Program
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li>Following a completed registration, the system generates a unique tracking link.</li>
                <li>If a new family registers utilizing your unique link, your account ledger will automatically be credited with a partial refund or discount balance.</li>
                <li>Referral credits are non-transferable, hold no cash value outside of Elevate Coders programs, and are subject to audit for fraudulent behavior.</li>
              </ul>
            </div>

            <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #E2E8F0' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                6. Physical Liability Waiver &amp; Hold Harmless Agreement
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0 }}>
                <li><strong>Assumption of Risk:</strong> By enrolling your child in an in-person Elevate Coders program, you acknowledge that minor physical mishaps—including but not limited to slipping, tripping, or falling within the classroom facility—are inherent risks of any group activity.</li>
                <li><strong>Release of Liability:</strong> You agree to release, waive, discharge, and hold harmless Elevate Coders, its owners, instructors, and assistants from any and all claims, demands, or liabilities for personal accidental injury, illness, or property damage sustained by your child while participating in the camp or present on the premises.</li>
              </ul>
            </div>

            <div style={{ background: '#FEF2F2', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid #FCA5A5' }}>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: '#991B1B', marginBottom: '8px' }}>
                7. Refund, Cancellation, and Week-Change Policy
              </h2>
              <p style={{ fontSize: '14px', color: '#7F1D1D', marginBottom: '8px' }}>
                To maintain small, high-quality cohorts and secure our staffing schedules, we enforce a strict booking timeline:
              </p>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', margin: 0, color: '#7F1D1D' }}>
                <li><strong>Cancellations Made 7 or More Days Prior:</strong> If you cancel your child&apos;s registration at least seven (7) full days before the scheduled camp week begins, you will receive a full refund of your payment.</li>
                <li><strong>Cancellations Made Less Than 7 Days Prior:</strong> Cancellations made within the seven (7) days leading up to the camp start date are non-refundable.</li>
                <li><strong>Credit Alternatives:</strong> For late cancellations (under 7 days notice), no cash or card refunds will be issued. However, Elevate Coders may, at its sole discretion, issue an internal account credit valid toward a future multi-week camp track, or allow the registration to be transferred to an alternate open week within the same season, provided space is available.</li>
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '18px', fontWeight: 700, color: 'var(--brand-purple)', marginBottom: '8px' }}>
                8. Legal, Liability, and Tax Compliance
              </h2>
              <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>0% Service Tax Compliance:</strong> In accordance with California educational services tax guidelines, registrations are subject to a 0% service tax threshold.</li>
                <li><strong>Classroom Boundaries &amp; Behavior:</strong> Students must follow all safety and behavioral rules outlined by instructors. Elevate Coders reserves the right to remove a student from a session if their behavior consistently compromises the safety or learning of others.</li>
                <li><strong>Media Release Opt-Out:</strong> Unless a parent explicitly submits a written photo/media opt-out to administration before the start of the camp session, Elevate Coders retains the right to use classroom photos and footage for future marketing, website materials, and promotional updates.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
