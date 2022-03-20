import axios from "axios";
import React, { useState } from "react";
import "./RegisterLogin.css";
import ReactPlayer from "react-player";
import Logo from "../pictures/S.mp4";
import "./RegisterLogin.css";

function Login() {
  const videoSrc = Logo;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:5000/api/login",
      data: {
        username: username,
        password: password,
      },
    })
      .then((res) => setIsLoggedIn(res.data))
      .catch((err) => console.log(err + "this is the error"));
  };
  console.log(isLoggedIn);
  return (
    <>
      <div className="line1"></div>
      <div className="line2"></div>
      <div className="outer">
        <div className="right">
          <div className="login-picture"></div>
          <div className="login">
            <h1 className="login-header">Login</h1>
            <form onSubmit={handleSubmit}>
              <input
                className="login-username"
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="login-password"
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="login-button">Login</button>
            </form>
            {/* <h2>welcome {firstname}</h2> */}
            {isLoggedIn && <h2>Welcome!</h2>}
            <div className="logo">
              <ReactPlayer
                url={videoSrc}
                playing={true}
                muted
                width={"342px"}
                height={"342px"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
