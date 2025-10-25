import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-slate-300 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-4">Page Not Found</h2>
          <p className="text-slate-600 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors duration-200 shadow-sm"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;