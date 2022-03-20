import React from "react";
import { useNavigate } from "react-router-dom";
import "./Success.css";
function Success() {
  let navigate = useNavigate();
  return (
    <div>
      <div className="welcome">Welcome Jaden!</div>
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
