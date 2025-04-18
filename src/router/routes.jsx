import RootLayout from "@/components/layout/RootLayout";

import NotFound from "@/pages/NotFound";
import ErrorPage from "@/pages/ErrorPage";
// Ensure that your routes are passed to a React Router component
import { Navigate } from "react-router-dom";



const PlaceholderPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
      Coming Soon
    </h1>
    <p className="mt-2 text-gray-600 dark:text-gray-400">
      This feature is currently under development.
    </p>
  </div>
);


const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />, // Handles crashes, API failures, etc.
    children: [
      { index: true, element: <PlaceholderPage /> }, // Default to  Dashboard
      { path: "customers", element: <PlaceholderPage /> }, // Customer list
      { path: "sales", element: <PlaceholderPage /> }, // Sales list

      { path: "dashboard", element: <Navigate to="/" replace /> }, // Redirect to default
      { path: "*", element: <NotFound /> }, // 404 Not Found
    ],
  },
];

export default routes;
