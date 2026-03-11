import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../services/endpoints';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // 'CUSTOMER' | 'ADMIN'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('btf_token');
    const savedRole = localStorage.getItem('btf_role');
    if (token && savedRole === 'CUSTOMER') {
      getProfile()
        .then((res) => {
          setUser(res.data);
          setRole('CUSTOMER');
        })
        .catch(() => {
          localStorage.removeItem('btf_token');
          localStorage.removeItem('btf_refresh_token');
          localStorage.removeItem('btf_role');
        })
        .finally(() => setLoading(false));
    } else if (token && savedRole === 'ADMIN') {
      setRole('ADMIN');
      setUser({ name: 'Admin' });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const loginCustomer = (authResponse) => {
    localStorage.setItem('btf_token', authResponse.accessToken);
    localStorage.setItem('btf_refresh_token', authResponse.refreshToken);
    localStorage.setItem('btf_role', 'CUSTOMER');
    setUser(authResponse.customer);
    setRole('CUSTOMER');
  };

  const loginAdmin = (authResponse) => {
    localStorage.setItem('btf_token', authResponse.accessToken);
    localStorage.setItem('btf_refresh_token', authResponse.refreshToken);
    localStorage.setItem('btf_role', 'ADMIN');
    setUser({ name: 'Admin' });
    setRole('ADMIN');
  };

  const logoutUser = () => {
    localStorage.removeItem('btf_token');
    localStorage.removeItem('btf_refresh_token');
    localStorage.removeItem('btf_role');
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginCustomer, loginAdmin, logoutUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
