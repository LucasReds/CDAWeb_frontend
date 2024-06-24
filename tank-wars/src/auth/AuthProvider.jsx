import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [playerId, setPlayerId] = useState(
    localStorage.getItem("player_id") || null
  );

  function logout() {
    setToken(null);
  }

  useEffect(() => {
    localStorage.setItem("token", token);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("player_id", playerId);
  }, [token, userId, playerId]);

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        logout,
        userId,
        setUserId,
        playerId,
        setPlayerId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
