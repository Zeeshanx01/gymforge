'use client';

const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

export default function UnauthorizedPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="mt-4 text-lg">You do not have permission to view this page.</p>
      <div className="mt-6">
        <p className="font-semibold">Only the following users are allowed to access this page:</p>
        <ul className="mt-2 text-gray-700">
          {adminEmails.map((email) => (
            <li key={email}>• {email.trim()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
