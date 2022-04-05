import axios from "axios";
import React, { useEffect, useState } from "react";
import "./RegisterLogin.css";
import ReactPlayer from "react-player";
import Logo from "../pictures/S.mp4";
import "./RegisterLogin.css";

// recoil values
import { usernameAtom } from "../atoms/global";
import { isLoggedInAtom } from "../atoms/global";
import { useRecoilState } from "recoil";

import { useNavigate } from "react-router-dom";

function Login() {
  const videoSrc = Logo;

  //added recoil, this makes the username value global if you use the useRecoil on the other page
  const [username, setUsername] = useRecoilState(usernameAtom);

  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);

  let navigate = useNavigate();

  useEffect(() => {
    isLoggedIn && navigate("/videos");
  }, [isLoggedIn]);
  //check if username and password match, then add videos as a string to user
  //2
  //log in
  const handleSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://capstone-2-jf.herokuapp.com/api/login",
      data: {
        username: username,
        password: password,
      },
    }).then((res) => setIsLoggedIn(res.data));
  };

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
