'use client'

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-6 py-12">
      <section className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Dashboard</h1>
        <p className="text-gray-400 mb-4">
          Overview of your workout stats, recent activity, and fitness progress.
        </p>
        {/* You can add charts or cards later */}
        <div className="border border-gray-700 p-6 rounded-lg text-center text-gray-400">
          No activity data yet. Start your journey!
        </div>
      </section>
    </main>
  )
}
