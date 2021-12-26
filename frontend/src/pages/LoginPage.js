import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);
  return (
    <div>
      <h3>Welcome back ;)</h3>
      <form onSubmit={loginUser} className="login-form">
        <label>Your username</label>
        <input type="text" name="username" placeholder="Username" />
        <label>Your password</label>
        <input type="password" name="password" placeholder="Password" />
        <input type="submit" />
      </form>
    </div>
  );
};

export default LoginPage;
