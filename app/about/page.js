'use client'
import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-zinc-100">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">About GymForge</h1>
        <p className="text-lg text-zinc-400">
          Transforming your fitness journey with powerful tools, tracking, and motivation.
        </p>
      </section>

      {/* Our Mission */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="text-zinc-400">
          GymForge exists to simplify your fitness tracking, help you stay consistent,
          and empower your body transformation journey—whether you&apos;re a beginner or an athlete.
        </p>
      </section>

      {/* Features Highlight */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">What We Offer</h2>
        <ul className="list-disc list-inside space-y-2 text-zinc-400">
          <li>Track workouts, sets, reps, and body progress effortlessly.</li>
          <li>Get AI-driven insights (coming soon) to improve performance.</li>
          <li>Simple, clean dashboard to stay focused on what matters.</li>
        </ul>
      </section>

      {/* Our Vision */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
        <p className="text-zinc-400">
          We believe in making fitness a habit, not a burden. Our goal is to build a supportive tool
          that motivates and evolves with you.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center mt-16">
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          Get Started
        </Link>
      </section>
    </div>
  )
}
