import axios from "axios";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:5000/api/register",
      data: {
        username: username,
        firstname: firstName,
        lastname: lastName,
        password: password,
      },
    })
      .then(({ data: success }) => success && navigate("/success"))
      .catch((err) => console.log(err + "this is the error"));
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };

  return (
    <>
      <div className="left">
        <div className="register-picture"></div>
        <form onSubmit={handleSubmit}>
          <h1 className="register-header">Register</h1>
          <input
            className="register-username"
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="register-firstname"
            type="text"
            placeholder="first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="register-lastname"
            type="text"
            placeholder="last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="register-password"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="register-submit">Submit</button>
        </form>
      </div>
    </>
  );
}

export default Register;