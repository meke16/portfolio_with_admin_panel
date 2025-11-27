import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <CardContent className="pt-10 pb-12 text-center">
          <AlertCircle className="mx-auto h-14 w-14 text-red-500" />

          <h1 className="mt-6 text-4xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">
            404
          </h1>

          <p className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            Page Not Found
          </p>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Sorry, the page you are looking for could not be found or may have been moved.
          </p>

          <a
            href="/"
            className="inline-block mt-8 px-6 py-3 rounded-lg bg-green-700 hover:bg-green-800
                       text-white text-sm font-semibold transition-all duration-200"
          >
            ← Back to Home
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
