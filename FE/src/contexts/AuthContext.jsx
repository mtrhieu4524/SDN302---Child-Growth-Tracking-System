import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Role } from "../enums/Role";
import api from "../configs/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (error) {
        if (error.response?.status === 401) {
          await refreshAccessToken();
        } else if (error.response?.status === 403) {
          await logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const refreshAccessToken = async () => {
    try {
      await api.post("/auth/renew-access-token");
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (error) {}
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { data } = await api.get("/auth/me");
      setUser(data.user);
      if (data.user.role === Role.ADMIN) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/signup", { name, email, password });
      return res;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
