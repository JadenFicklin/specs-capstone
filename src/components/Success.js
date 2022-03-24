import React from "react";
import { useNavigate } from "react-router-dom";
import "./Success.css";

// recoil values
import { usernameAtom } from "../atoms/global";
import { useRecoilState } from "recoil";

function Success() {
  let navigate = useNavigate();

  //added from recoil
  const [username, setUsername] = useRecoilState(usernameAtom);
  console.log(username);

  return (
    <div>
      <div className="welcome">Welcome {username}!</div>
      <div className="welcome-account-created">Account created</div>
      <div className="successfully">successfully!</div>

      <button
        className="welcome-continue"
        onClick={() => {
          navigate("/videos");
        }}
      >
        CONTINUE
      </button>
    </div>
  );
}

export default Success;
