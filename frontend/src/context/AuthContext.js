import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  // state of authtokens. get it from localstorage and parse to JSON, if it exists. otherwise set to Null
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  // same for userdata, coded in the token
  let [userData, setUserData] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );
  // loading state
  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // login function
  let loginUser = async (e) => {
    e.preventDefault();

    // send username and password to backend
    let response = await fetch("/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    let data = await response.json();

    // if data was accepted update authtokens and userdata, save token in local storage, redirect to homepage
    if (response.status === 200) {
      setAuthTokens(data);
      setUserData(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      alert("Cannot login");
    }
  };

  // refresh token send refresh token, if it exists
  let refreshToken = async () => {
    let response = await fetch("/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });
    let data = await response.json();

    // if data is accepted, update tokens and localstorage
    if (response.status === 200) {
      setAuthTokens(data);
      setUserData(jwt_decode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    }
    // if not - logout user
    else {
      logoutUser();
    }

    // set loading to false (used later)
    if (loading) {
      setLoading(false);
    }
  };

  // logout, set tokens and userdata to null, remove from local storage
  let logoutUser = () => {
    setAuthTokens(null);
    setUserData(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  // provided data
  let contextData = {
    userData: userData,
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  // if loading is true, call refresh tokens every 14 minutes
  useEffect(() => {
    if (loading) {
      refreshToken();
    }
    let fourteenMinutes = 1000 * 14 * 60;
    let interval = setInterval(() => {
      if (authTokens) {
        refreshToken();
      }
    }, fourteenMinutes);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
