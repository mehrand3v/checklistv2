// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { InspectionProvider } from "@/context/InspectionContext";
import { Toaster } from "sonner";

// Layouts
import RootLayout from "@/components/layout/RootLayout";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

// User Pages
import StoreInfoPage from "@/pages/StoreInfoPage";
import CategoryPage from "@/components/inspection/CategoryPage";
import ReviewPage from "@/pages/ReviewPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import LoginPage from "@/pages/admin/LoginPage";

function App() {
  return (
    <Router>
      <AuthProvider>
        <InspectionProvider>
          <Routes>
            {/* User Routes */}
            <Route path="/" element={<RootLayout />}>
              <Route index element={<StoreInfoPage />} />
              <Route path="inspection/:categoryId" element={<CategoryPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="confirmation/:id" element={<ConfirmationPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>

          {/* Global Toast Container */}
          <Toaster position="top-right" />
        </InspectionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
