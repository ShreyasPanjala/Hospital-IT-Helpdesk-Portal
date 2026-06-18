import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import Reports from './pages/Reports';
import './App.css';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/create-ticket" element={<Protected><CreateTicket /></Protected>} />
      <Route path="/tickets/:id" element={<Protected><TicketDetails /></Protected>} />
      <Route path="/reports" element={<Protected><Reports /></Protected>} />
    </Routes>
  </BrowserRouter>;
}

export default function App() {
  return <AuthProvider><AppRoutes /></AuthProvider>;
}
