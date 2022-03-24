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
  const [arrayOfPastVideos, setArrayOfPastVideos] =
    useRecoilState(pastVideosAtom);

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
  //add video info to database
  const handleSubmit1 = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://localhost:5000/api/uploadvideo",
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
  //
  //
  //
  //

  //2
  //display & hold 1 random video
  useEffect(() => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/getvideo",
      data: {
        username: username,
      },
    })
      .then((res) => handleGetVideo(res.data))
      .catch((err) => console.log(err));
  }, []);
  const handleGetVideo = (param) => {
    const splitString = param.split(","); //split string
    const randomElement =
      splitString[Math.floor(Math.random() * splitString.length)]; //random url
    setVid(randomElement); //set vid to url
    setArrayOfPastVideos(...arrayOfPastVideos, randomElement); //capture values
  };

  //next video
  const nextVideo = () => {
    //3
    //delete all videos from users database
    axios({
      method: "POST",
      url: "http://localhost:5000/api/deletevideo",
      data: {
        username: username,
      },
    })
      .then((res) => {
        console.log("next video");
      })
      .catch((err) => console.log(err));

    //get all videos
    axios({
      method: "GET",
      url: "http://localhost:5000/api/getallvids",
    })
      .then((res) => {
        //take the array of 4 objects and return an array with 4 strings
        let myurls = [];
        for (let i = 0; i < res.data.length; i++) {
          myurls.push(res.data[i].url);
        }
        //splices out past videos from all videos,, stores new array into myurls
        myurls = myurls.filter((val) => !arrayOfPastVideos.includes(val));
        const joined = myurls.join(",");

        axios({
          method: "POST",
          url: "http://localhost:5000/api/sendnewurls",
          data: {
            username: username,
            joined: joined,
          },
        })
          .then((res) => console.log("added new urls"))
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
