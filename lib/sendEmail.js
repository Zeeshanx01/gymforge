// lib/sendEmail.js

import { Resend } from 'resend'

const resend = new Resend('re_KktYkQQJ_NWr5cT1cxKug1KQH8Hisj2w3')

export async function sendEmail(email) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@gymforge.dev', // You must verify this sender in Resend
      to: [email],
      subject: 'Welcome to GymForge 💪',
      html: '<strong>You have successfully logged in to GymForge.</strong>',
    })

    if (error) {
      console.error('Email error:', error)
    }

    return data
  } catch (err) {
    console.error('Email sending failed:', err)
  }
}
