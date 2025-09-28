import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Go Back to Home
      </Link>
    </div>
  );
}

export default NotFound;