'use client'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-6 py-12">
      <section className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Welcome to <span className="text-blue-500">GymForge</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-10">
          Forge your body. Track your progress. Stay consistent.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition">
            Get Started
          </button>
          <button className="border border-gray-500 hover:border-gray-300 text-gray-300 hover:text-white px-6 py-3 rounded-lg transition">
            Learn More
          </button>
        </div>
      </section>
    </main>
  )
}
