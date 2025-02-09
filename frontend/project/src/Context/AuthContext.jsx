import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const [subscribed, setSubscribed] = useState(false);

  const setAuthData = (token, username) => {
    setToken(token);
    setUser(username);
    localStorage.setItem("authToken", token);
  };
  const setSubscription = (subscribed) => {
    setSubscribed(subscribed);
    localStorage.setItem("subscribed", subscribed);
  }

  const setTokenFromStorage = (token) => {
    setToken(token);
  }

  const logout = () => {
    setToken("");
    setUser(null);
    setSubscribed(false);
    localStorage.removeItem("subscribed");
    localStorage.removeItem("authToken");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const subscription = localStorage.getItem("subscribed");
    if(subscription){
      setSubscribed(true)
    }
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, setAuthData, setTokenFromStorage, logout, subscribed, setSubscription }}>
      {children}
    </AuthContext.Provider>
  );
};
