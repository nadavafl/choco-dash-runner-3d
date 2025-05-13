
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Available routes: /, /test-canvas"
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-gray-500 mb-6">
          The route "{location.pathname}" does not exist
        </p>
        <div className="space-y-2">
          <Link to="/" className="block text-blue-500 hover:text-blue-700 underline">
            Return to Home
          </Link>
          <Link to="/test-canvas" className="block text-blue-500 hover:text-blue-700 underline">
            Go to Test Canvas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
