import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [email, setEmail] = useState("");

  let navigate = useNavigate();

  let handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmation) {
      registerUser();
    } else {
      alert("passwords must match");
    }
  };

  let registerUser = async () => {
    let data = { username: username, password: password, email: email };
    let response = await fetch("/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 200) {
      navigate("/");
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h3>Fill the form to register on the website</h3>
      <form onSubmit={handleSubmit} className="register-form">
        <label>Your username?</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Enter your password</label>
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm your password</label>
        <input
          type="password"
          name="confirmation"
          value={confirmation}
          placeholder="Password"
          onChange={(e) => setConfirmation(e.target.value)}
        />
        <label>Your e-mail adress</label>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input type="submit" />
      </form>
    </div>
  );
};

export default RegisterPage;
