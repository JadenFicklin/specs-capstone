import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Logo from "../pictures/S.mp4";
import "./Videos.css";
import axios from "axios";
import { usernameAtom } from "../atoms/global";
import { isLoggedInAtom } from "../atoms/global";
import { vidAtom } from "../atoms/global";
import { useRecoilState } from "recoil";

function Videos() {
  //button press animation effect
  const [stats, setStats] = useState(true);
  const [button, setButton] = useState(true);
  const [button2, setButton2] = useState(true);
  const [button3, setButton3] = useState(true);
  const [button4, setButton4] = useState(true);
  const [comments, setComments] = useState(true);

  //open the upload video box / comments box / stats box
  const [upload, setUpload] = useState(false);
  const [openComments, setOpenComments] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  const [statsName, setStatsName] = useState("");
  const [statsVotes, setStatsVotes] = useState("");

  //upload url and name to database
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const [vid, setVid] = useRecoilState(vidAtom);

  //added from recoil
  const [username, setUsername] = useRecoilState(usernameAtom);

  //a-z
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInAtom);

  //timer for button animations
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

  //allows user to use arrows to navigate webpage
  const handleUserKeyPress = ({ key }) => {
    key === "ArrowUp" && setButton2(false);
    key === "ArrowDown" && setButton(false);
    key === "ArrowLeft" && setButton3(false);
    key === "ArrowRight" && setButton4(false);
  };
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, []);
  /////////////////////////////
  //a
  //display video & capture it
  const displayCaptureDelete = useEffect(() => {
    //b
    //display
    axios({
      method: "POST",
      url: "http://localhost:5000/api/displayvideo",
      data: {
        username: username,
      },
    }).then((res) => setVid(res.data));
  }, []);

  //c
  //delete video from vids and add to watched
  const nextVid = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/deletevideo",
      data: {
        username: username,
        vid: vid,
      },
    }).then((res) => console.log(res));
    //d
    //grab new random vid and setVid to it
    axios({
      method: "POST",
      url: "http://localhost:5000/api/getnewrandomvideo",
      data: {
        username: username,
        vid: vid,
      },
    }).then((res) => setVid(res.data));
  };
  //e
  //display previous video
  const previousClick = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/previousvid",
      data: {
        username: username,
      },
    })
      .then((res) => setVid(res.data))
      .catch((err) => console.log(err));
  };
  //f
  //remove vid info in database when user logs out
  const removeVidInfo = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/removevidinfo",
      data: {
        username: username,
      },
    }).then((res) => console.log(res));
  };

  //3
  //add video info to database
  const handleSubmit1 = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:5000/api/uploadvideo",
      data: {
        url: url,
        name: name,
        username: username,
      },
    })
      .then(() => {
        console.log("video uploaded");
      })
      .catch((err) => console.log(err));
  };

  //4
  //downvotes
  const handleDownvoteVideo = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/downvotevideo",
      data: {
        url: vid,
      },
    }).then((res) => console.log(res));
  };
  //5
  //upvotes
  const handleUpvoteVideo = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/upvotevideo",
      data: {
        url: vid,
      },
    }).then((res) => console.log(res));
  };
  //6
  //display name and votes in stats box
  const handleGetStats = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/getstats",
      data: {
        url: vid,
      },
    }).then((res) => {
      setStatsName(res.data[0].name);
      setStatsVotes(res.data[0].votes || 0);
    });
  };

  const videoSrc = Logo;
  let navigate = useNavigate();

  return (
    <>
      <button
        className="videos-logout"
        onClick={() => {
          navigate("/");
          setIsLoggedIn(false);
          removeVidInfo();
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
          SOPI.COM{" "}
          <span className="logged-in-as">--- Logged in as {username}</span>
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
          <form className="upload-box" onSubmit={handleSubmit1}>
            <div className="video-url">video url</div>
            <div className="name-of-video">name of video</div>
            <input
              className="input-box-url"
              onChange={(e) => setUrl(e.target.value)}
            ></input>
            <input
              className="input-box-name"
              onChange={(e) => setName(e.target.value)}
            ></input>
            <button className="videos-submit">SUBMIT</button>
          </form>
        )}

        <div className="video">
          <ReactPlayer
            url={vid}
            playing={true}
            controls
            width={"1680px"}
            height={"740px"}
          />
        </div>

        {/* stats */}
        {stats ? (
          <div
            className="stats"
            onClick={() => {
              setStats(!stats);
              setOpenStats(!openStats);
              handleGetStats();
            }}
          >
            stats
          </div>
        ) : (
          <div className="videos-stats-after" onClick={() => setStats(!stats)}>
            stats
          </div>
        )}
        {/* button */}
        {button ? (
          <div
            className="videos-downvote"
            onClick={() => {
              setButton(!button);
              handleDownvoteVideo();
            }}
          >
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
          <div
            className="videos-upvote"
            onClick={() => {
              setButton2(!button2);
              handleUpvoteVideo();
            }}
          >
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
          <div
            className="videos-left"
            onClick={() => {
              setButton3(!button3);
              previousClick();
            }}
          >
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
          <div
            className="videos-right"
            onClick={() => {
              setButton4(!button4);
              nextVid();
            }}
          >
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
          <div
            className="comments"
            onClick={() => {
              setComments(!comments);
              setOpenComments(!openComments);
            }}
          >
            comments
          </div>
        ) : (
          <div className="comments-after" onClick={() => setComments(!button)}>
            comments
          </div>
        )}
        {openComments && (
          <form className="comments-box">
            <input
              type="text"
              placeholder="add comment"
              className="comments-input"
            />
            <button className="comments-submit">submit</button>
          </form>
        )}
        {openStats && (
          <div className="stats-box">
            <div className="stats-name">name: {statsName}</div>
            <div className="stats-votes">votes: {statsVotes}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default Videos;
