'use client'
import React from 'react'

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-zinc-100">
      {/* Heading */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-zinc-400">We’d love to hear from you. Let’s connect!</p>
      </section>

      {/* Contact Info */}
      <section className="grid sm:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-xl font-semibold mb-2">Support</h2>
          <p className="text-zinc-400">Email: <a href="mailto:support@gymforge.com" className="text-blue-400 hover:underline">support@gymforge.com</a></p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Collaborations</h2>
          <p className="text-zinc-400">Interested in working together? Reach out!</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-zinc-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
            required
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
          >
            Send
          </button>
        </form>
      </section>
    </div>
  )
}
