'use client';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you are looking for does not exist.</p>
    </div>
  );
}
