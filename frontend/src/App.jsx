
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/Navbar';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LostAndFound from './pages/LostAndFound';
import Outpass from './pages/Outpass';

// Admin Auth
import AdminLogin from './pages/admin/AdminLogin';
import AdminRegister from './pages/admin/AdminRegister';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      {/* Toast notifications container */}
      <Toaster position="bottom-right" toastOptions={{ style: { background: '#1e293b', color: '#fff' } }} />
      

      <Navbar />

      <Routes>

        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin-login"    element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />

        {/* ---------- Protected Routes ---------- */}


        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/outpass"
          element={
            <ProtectedRoute>
              <Outpass />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lost-found"
          element={
            <ProtectedRoute>
              <LostAndFound />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
