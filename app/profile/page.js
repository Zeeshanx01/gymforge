'use client'

export default function Profile() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-6 py-12">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Your Profile</h1>
        <p className="text-gray-400 mb-4">Manage your account and personal settings.</p>

        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Username</h2>
            <p className="text-gray-400">zeeshan.gym</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <p className="text-gray-400">you@example.com</p>
          </div>
        </div>
      </section>
    </main>
  )
}
