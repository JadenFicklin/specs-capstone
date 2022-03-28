import axios from "axios";
import React, { useState, useEffect } from "react";
import { usernameAtom } from "../atoms/global";
import { useRecoilState } from "recoil";

import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useRecoilState(usernameAtom);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    accountCreated && navigate("/success");
  }, [accountCreated]);

  //1
  //send user info to database
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
      .then((res) => setAccountCreated(res.data))
      .catch((err) => console.log(err + "this is the error"));
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
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="register-firstname"
            type="text"
            placeholder="first name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            className="register-lastname"
            type="text"
            placeholder="last name"
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            className="register-password"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="register-submit">Submit</button>
        </form>
        {accountCreated ? <h2>Account created!</h2> : null}
      </div>
    </>
  );
}

export default Register;
