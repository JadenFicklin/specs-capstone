import React from "react";
import { useNavigate } from "react-router-dom";
import "./TopVideos.css";
import Logo from "../pictures/S.mp4";
import ReactPlayer from "react-player";

function TopVideos() {
  let navigate = useNavigate();
  const videoSrc = Logo;
  return (
    <>
      <div className="top-outer">
        <div className="videos-logo">
          <ReactPlayer
            url={videoSrc}
            playing={true}
            muted
            width={"100px"}
            height={"100px"}
          />
        </div>
        <div className="top-nav">
          <div className="top-sopi" onClick={() => navigate("/videos")}>
            SOPI.COM
          </div>
          <div className="top-vids" onClick={() => navigate("/topvideos")}>
            top videos
          </div>
          <div className="top-upload">upload video</div>
          <div className="top-logout" onClick={() => navigate("/")}>
            log out
          </div>
        </div>
        <div className="top-blue-background">
          <div className="top-three">
            <div className="top-firstvid">
              <div className="top-picture"></div>
              <div className="top-name">Adventure time!</div>
            </div>
          </div>
          <div className="top-other-vids"></div>
        </div>
      </div>
    </>
  );
}

export default TopVideos;

//   return (
//     <div>
//       <h1>Account created!</h1>
//       <button
// onClick={() => {
//   navigate("/videos");
//         }}
//       >
//         go to videos page
//       </button>
