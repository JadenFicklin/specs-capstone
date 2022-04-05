import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import Logo from "../pictures/S.mp4";
import "./Videos.css";
import axios from "axios";
import { usernameAtom } from "../atoms/global";
import { pastVideosAtom } from "../atoms/global";
import { useRecoilState } from "recoil";

function Videos() {
  //button press animation effect
  const [stats, setStats] = useState(true);
  const [button, setButton] = useState(true);
  const [button2, setButton2] = useState(true);
  const [button3, setButton3] = useState(true);
  const [button4, setButton4] = useState(true);
  const [comments, setComments] = useState(true);

  //open the upload video box / comments box
  const [upload, setUpload] = useState(false);
  const [openComments, setOpenComments] = useState(false);

  //upload url and name to database
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const [vid, setVid] = useState("");

  //added from recoil
  const [username, setUsername] = useRecoilState(usernameAtom);

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
  //3
  //add video info to database
  const handleSubmit1 = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "https://capstone-2-jf.herokuapp.com/api/uploadvideo",
      data: {
        url: url,
        name: name,
      },
    })
      .then(() => {
        console.log("video uploaded");
      })
      .catch((err) => console.log(err));
  };

  //4
  //capture videos data && random
  useEffect(() => {
    axios({
      method: "GET",
      url: "https://capstone-2-jf.herokuapp.com/api/capturevideos",
    })
      .then((res) => {
        const randomurl =
          res.data[Math.floor(Math.random() * res.data.length)].url;
        setVid(randomurl);
        //5
        //add to watched database
        axios({
          method: "POST",
          url: "https://capstone-2-jf.herokuapp.com/api/addtowatched",
          data: {
            randomurl: randomurl,
            username: username,
          },
        })
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  //get a video that isnt in the watched list, setvid, send new url to watched list
  const nextVideo = () => {
    //6
    //get a random video from database
    axios({
      method: "GET",
      url: "https://capstone-2-jf.herokuapp.com/api/getnewvid",
    })
      .then((res) => {
        const randomurl =
          res.data[Math.floor(Math.random() * res.data.length)].url;
        //7
        //pull the watched videos so i can compare the 2 arrays
        axios({
          method: "POST",
          url: "https://capstone-2-jf.herokuapp.com/api/getwatched",
          data: {
            username: username,
          },
        })
          .then((res) => {
            console.log(randomurl); // this is new video -- good

            const splitResData = res.data[0].watched.split(","); //split string to individual values in array
            const uniq = [...new Set(splitResData)]; //remove duplicates
            console.log(uniq);

            const currentVideo = randomurl;
            const watchedVideos = uniq;

            const found = watchedVideos.find(
              (element) => element === currentVideo
            );

            if (found) {
              console.log("you have already watched this video");
              // make a new random number and try again
              nextVideo();
            } else {
              console.log("you have NOT watched this video yet");
              // add the current number to the watched videos
              // update the watched videos in the database for the user
              setVid(randomurl);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

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
          <div
            className="videos-right"
            onClick={() => {
              setButton4(!button4);
              nextVideo();
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
        {openComments && <div className="comments-box"></div>}
      </div>
    </>
  );
}

export default Videos;
