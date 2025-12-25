import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Contact from './pages/Contact';
import About from './pages/About';
import Help from './pages/Help';
import FarmerRegistrationDetails from './pages/farmer/FarmerRegistrationDetails';
import CompanyRegistrationDetails from './pages/company/CompanyRegistrationDetails';
import AdminDashboard from './pages/admin/AdminDashboard';
import FarmerManagement from './pages/admin/FarmerManagement';
import CompanyManagement from './pages/admin/CompanyManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />

          {/* Farmer Routes */}
          <Route path="/farmer/registration-details" element={<FarmerRegistrationDetails />} />

          {/* Company Routes */}
          <Route path="/company/registration-details" element={<CompanyRegistrationDetails />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/farmers" element={<FarmerManagement />} />
          <Route path="/admin/companies" element={<CompanyManagement />} />

          {/* Placeholder routes - to be implemented */}
          {/* <Route path="/farmer/dashboard" element={<FarmerDashboard />} /> */}
          {/* <Route path="/company/dashboard" element={<CompanyDashboard />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;