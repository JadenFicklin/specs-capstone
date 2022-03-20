import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Logo from "../pictures/S.mp4";
import "./Videos.css";

function Videos() {
  const [stats, setStats] = useState(true);
  const [button, setButton] = useState(true);
  const [button2, setButton2] = useState(true);
  const [button3, setButton3] = useState(true);
  const [button4, setButton4] = useState(true);
  const [comments, setComments] = useState(true);
  const [upload, setUpload] = useState(false);

  useEffect(() => {
    !stats && setTimeout(() => setStats(true), 200);
  }, [stats]);
  useEffect(() => {
    !button && setTimeout(() => setButton(true), 200);
  }, [button]);
  useEffect(() => {
    !button2 && setTimeout(() => setButton2(true), 200);
  }, [button2]);
  useEffect(() => {
    !button3 && setTimeout(() => setButton3(true), 200);
  }, [button3]);
  useEffect(() => {
    !button4 && setTimeout(() => setButton4(true), 200);
  }, [button4]);
  useEffect(() => {
    !comments && setTimeout(() => setComments(true), 200);
  }, [comments]);

  const videoSrc = Logo;
  let navigate = useNavigate();

  return (
    <>
      <button
        className="videos-logout"
        onClick={() => {
          navigate("/");
        }}
      >
        log out
      </button>
      <div className="videos-outer">
        <div className="videos-logo">
          <ReactPlayer
            url={videoSrc}
            playing={true}
            muted
            width={"100px"}
            height={"100px"}
          />
        </div>
        <div
          className="videos-website-name"
          onClick={() => navigate("/videos")}
        >
          SOPI.COM
        </div>
        <div
          className="videos-top-videos"
          onClick={() => navigate("/topvideos")}
        >
          top videos
        </div>
        <div className="videos-upload-video" onClick={() => setUpload(!upload)}>
          upload video
        </div>
        {upload && (
          <form className="upload-box">
            <div className="video-url">video url</div>
            <div className="name-of-video">name of video</div>
            <input className="input-box-url"></input>
            <input className="input-box-name"></input>
            <button className="videos-submit">SUBMIT</button>
          </form>
        )}
        <div className="video"></div>

        {/* stats */}
        {stats ? (
          <div className="stats" onClick={() => setStats(!stats)}>
            stats
          </div>
        ) : (
          <div className="videos-stats-after" onClick={() => setStats(!stats)}>
            stats
          </div>
        )}
        {/* button */}
        {button ? (
          <div className="videos-downvote" onClick={() => setButton(!button)}>
            <div className="arrow1"></div>
          </div>
        ) : (
          <div
            className="videos-downvote-after"
            onClick={() => setButton(!button)}
          >
            <div className="arrow1"></div>
          </div>
        )}
        {/* button2 */}
        {button2 ? (
          <div className="videos-upvote" onClick={() => setButton2(!button2)}>
            <div className="arrow2"></div>
          </div>
        ) : (
          <div
            className="videos-upvote-after"
            onClick={() => setButton2(!button2)}
          >
            <div className="arrow2"></div>
          </div>
        )}
        {/* button3 */}
        {button3 ? (
          <div className="videos-left" onClick={() => setButton3(!button3)}>
            <div className="arrow3"></div>
          </div>
        ) : (
          <div
            className="videos-left-after"
            onClick={() => setButton3(!button3)}
          >
            <div className="arrow3"></div>
          </div>
        )}
        {/* button4 */}
        {button4 ? (
          <div className="videos-right" onClick={() => setButton4(!button4)}>
            <div className="arrow4"></div>
          </div>
        ) : (
          <div
            className="videos-right-after"
            onClick={() => setButton4(!button4)}
          >
            <div className="arrow4"></div>
          </div>
        )}
        {/* comments */}
        {comments ? (
          <div className="comments" onClick={() => setComments(!comments)}>
            comments
          </div>
        ) : (
          <div className="comments-after" onClick={() => setComments(!button)}>
            comments
          </div>
        )}
      </div>
    </>
  );
}

export default Videos;
