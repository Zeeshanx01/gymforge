'use client'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function Progress() {
  return (<>
    <ProtectedRoute>

      <main className="min-h-screen bg-gray-950 text-gray-100 px-6 py-12">
        <section className="max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Progress Tracker</h1>
          <p className="text-gray-400 mb-4">
            Visualize your improvement over time.
          </p>

          <div className="border border-gray-700 p-6 rounded-lg text-center text-gray-400">
            No progress logged yet. Start tracking your workouts!
          </div>
        </section>
      </main>

    </ProtectedRoute>
  </>)
}
