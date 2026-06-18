import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('helpdeskUser') || 'null'));
  const [loading, setLoading] = useState(false);

  const saveSession = ({ token, user }) => {
    localStorage.setItem('helpdeskToken', token);
    localStorage.setItem('helpdeskUser', JSON.stringify(user));
    setUser(user);
  };

  const login = async (form) => { setLoading(true); try { const { data } = await api.post('/auth/login', form); saveSession(data); } finally { setLoading(false); } };
  const register = async (form) => { setLoading(true); try { const { data } = await api.post('/auth/register', form); saveSession(data); } finally { setLoading(false); } };
  const logout = () => { localStorage.removeItem('helpdeskToken'); localStorage.removeItem('helpdeskUser'); setUser(null); };

  useEffect(() => { if (!localStorage.getItem('helpdeskToken')) setUser(null); }, []);
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
