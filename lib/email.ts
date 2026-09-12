// lib/email.ts — Business Email Alert Notification Helper

export interface RegistrationAlertDetails {
  registrationId: string
  studentName: string
  studentAge: number
  track: string
  parentName: string
  parentEmail: string
  parentPhone: string
  selectedWeekNumbers: number[]
  finalTotal: number
  paymentMethod: string
  vacationDaysCount: number
  discountCode?: string
  referralCode?: string
  referrerName?: string
  referralCreditDeducted?: number
}

export async function sendRegistrationAlert(data: RegistrationAlertDetails) {
  const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'hello@elevatecoders.com'
  const apiKey = process.env.RESEND_API_KEY

  const subject = `🎉 New Registration: ${data.studentName} (${data.track} Track)`

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #7C3AED; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">New Camp Registration! ⚡</h1>
        <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Elevate Coders — Fall 2026</p>
      </div>

      <div style="padding: 24px; color: #1F2937;">
        <h2 style="font-size: 18px; color: #1E1B4B; margin-top: 0; border-bottom: 2px solid #EDE9FE; padding-bottom: 8px;">
          Student Details
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #6B7280; width: 140px;">Student Name:</td>
            <td style="font-weight: bold;">${data.studentName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Age:</td>
            <td>${data.studentAge} years old</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Track:</td>
            <td><span style="background: #EDE9FE; color: #5B21B6; padding: 2px 8px; border-radius: 12px; font-weight: bold; font-size: 12px;">${data.track}</span></td>
          </tr>
        </table>

        <h2 style="font-size: 18px; color: #1E1B4B; margin-top: 0; border-bottom: 2px solid #EDE9FE; padding-bottom: 8px;">
          Parent / Guardian
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #6B7280; width: 140px;">Legal Name:</td>
            <td style="font-weight: bold;">${data.parentName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Email:</td>
            <td><a href="mailto:${data.parentEmail}" style="color: #7C3AED;">${data.parentEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Phone:</td>
            <td><a href="tel:${data.parentPhone}" style="color: #7C3AED;">${data.parentPhone}</a></td>
          </tr>
        </table>

        <h2 style="font-size: 18px; color: #1E1B4B; margin-top: 0; border-bottom: 2px solid #EDE9FE; padding-bottom: 8px;">
          Enrollment & Billing
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 6px 0; color: #6B7280; width: 140px;">Selected Weeks:</td>
            <td style="font-weight: bold;">Weeks ${data.selectedWeekNumbers.join(', ')}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Vacation Days:</td>
            <td>${data.vacationDaysCount > 0 ? `${data.vacationDaysCount} day(s) prorated` : 'None'}</td>
          </tr>
          ${data.discountCode ? `
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Discount Code:</td>
            <td style="color: #059669; font-weight: bold;">${data.discountCode}</td>
          </tr>
          ` : ''}
          ${data.referralCode ? `
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Referral Code:</td>
            <td style="color: #7C3AED; font-weight: bold;">
              ${data.referralCode} ${data.referrerName ? `(Referrer: ${data.referrerName} — $25 future program / sibling credit logged)` : ''}
            </td>
          </tr>
          ` : ''}
          ${data.referralCreditDeducted && data.referralCreditDeducted > 0 ? `
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Earned Referral Credit Applied:</td>
            <td style="color: #7C3AED; font-weight: bold;">-$${data.referralCreditDeducted.toFixed(2)} (auto-redeemed from balance)</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Total Amount:</td>
            <td style="font-size: 18px; font-weight: bold; color: #7C3AED;">$${data.finalTotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #6B7280;">Payment Method:</td>
            <td>${data.paymentMethod === 'ACH_AND_CREDIT_CARD' ? 'ACH + Credit Card' : 'ACH Only'}</td>
          </tr>
        </table>

        <div style="background-color: #F9FAFB; padding: 12px; border-radius: 6px; font-size: 12px; color: #6B7280; margin-top: 20px;">
          Registration ID: <code>${data.registrationId}</code>
        </div>
      </div>
    </div>
  `

  console.log(`[BUSINESS EMAIL ALERT] Prepared registration alert for ${adminEmail}: ${data.studentName} enrolled in Weeks ${data.selectedWeekNumbers.join(', ')}`)

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'Elevate Coders <onboarding@resend.dev>',
          to: [adminEmail],
          subject,
          html,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('[EMAIL ERROR] Resend API error:', errText)
      } else {
        console.log(`[EMAIL SUCCESS] Business alert sent to ${adminEmail}`)
      }
    } catch (err) {
      console.error('[EMAIL ERROR] Failed to dispatch email alert:', err)
    }
  } else {
    console.log('[EMAIL NOTICE] Set RESEND_API_KEY in .env.local to enable live email delivery.')
  }
}
