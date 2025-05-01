import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
        <div className="flex justify-center mb-4">
          <Sparkle className="h-12 w-12 text-indigo-500" />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent">PrettyData</h1>
        <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          className="bg-gradient-to-r from-indigo-500 to-teal-500 text-white"
          onClick={() => window.location.href = "/"}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
