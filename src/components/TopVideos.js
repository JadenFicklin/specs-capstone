import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TopVideos.css";
import Logo from "../pictures/S.mp4";
import ReactPlayer from "react-player";

function TopVideos() {
  const [upload, setUpload] = useState(false);

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
          <div className="top-upload" onClick={() => setUpload(!upload)}>
            upload video
          </div>
          {upload && (
            <form className="upload-box" style={{ top: "138px" }}>
              <div className="video-url">video url</div>
              <div className="name-of-video">name of video</div>
              <input className="input-box-url"></input>
              <input className="input-box-name"></input>
              <button className="videos-submit">SUBMIT</button>
            </form>
          )}
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
