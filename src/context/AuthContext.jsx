import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authService.getCurrentUser());
    setLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (e, p) => {
        const u = authService.login(e, p);
        setUser(u);
      },
      register: async (n, e, p) => {
        const u = authService.register(n, e, p);
        setUser(u);
      },
      logout: () => {
        authService.logout();
        setUser(null);
      },
      updateProfile: (upd) => setUser(authService.updateProfile(upd)),
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
