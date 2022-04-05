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
import Component2 from "./Component2";
import useLockVotes from "./useLockVotes";

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
  const [index, setIndex] = useState(0);

  //add comments
  const [userComment, setUserComment] = useState("");
  const [holdComments, setHoldComments] = useState([]);

  const [alreadyVoted, setAlreadyVoted] = useState(false);

  const { checkVotes, lockVotes, checkComments, lockComments } = useLockVotes;

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

  useEffect(() => {
    username && vid && checkVotes(username, vid, setAlreadyVoted);
  }, [username, vid]);

  //4
  //downvotes
  const handleDownvoteVideo = () => {
    axios({
      method: "POST",
      url: "http://capstone-2-jf.herokuapp.com/api/downvotevideo",
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
      url: "http://capstone-2-jf.herokuapp.com/api/upvotevideo",
      data: {
        url: vid,
      },
    }).then((res) => console.log(res));
  };

  const handleArrowUp = () => {
    setButton2(false);
    handleUpvoteVideo();
  };
  const handleArrowDown = () => {
    setButton(false);
    handleDownvoteVideo();
  };

  const handleArrowLeft = () => {
    setButton3(false);
    setIndex(index - 1);
  };

  const handleArrowRight = () => {
    setButton4(false);
    setIndex(index + 1);
  };

  //allows user to use arrows to navigate webpage
  const handleUserKeyPress = ({ key }) => {
    // key === "ArrowUp" && handleArrowUp();
    // key === "ArrowDown" && handleArrowDown();
    key === "ArrowLeft" && handleArrowLeft();
    key === "ArrowRight" && handleArrowRight();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [index]);

  //delete comments if it hits -2 votes
  useEffect(() => {
    axios({
      method: "POST",
      url: "http://capstone-2-jf.herokuapp.com/api/deletecomment",
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  const downVote = () => {
    if (!alreadyVoted) {
      lockVotes(username, vid);
      setButton(!button);
      setAlreadyVoted(true);
      handleDownvoteVideo();
    }
  };

  const upVote = () => {
    if (!alreadyVoted) {
      lockVotes(username, vid);
      setButton2(!button2);
      setAlreadyVoted(true);
      handleUpvoteVideo();
    }
  };

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://capstone-2-jf.herokuapp.com/api/getdatabasevideos",
    })
      .then((res) => {
        if (index < 0) {
          setIndex(0);
        } else if (index > res.data.length) {
          setIndex(res.data.length - 1);
        } else {
          setVid(res.data[index].url);
        }
      })
      .catch((err) => console.log(err));
  }, [button4, button3, setIndex]);

  //3
  //add video info to database
  const handleSubmit1 = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://capstone-2-jf.herokuapp.com/api/uploadvideo",
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
  //6
  //display name and votes in stats box
  const handleGetStats = () => {
    axios({
      method: "POST",
      url: "http://capstone-2-jf.herokuapp.com/api/getstats",
      data: {
        url: vid,
      },
    }).then((res) => {
      setStatsName(res.data[0].name);
      setStatsVotes(res.data[0].votes || 0);
    });
  };
  //add comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    axios({
      method: "POST",
      url: "http://capstone-2-jf.herokuapp.com/api/addcomment",
      data: {
        vid: vid,
        username: username,
        comment: userComment,
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  //display comments
  const handleCommentsClick = () => {
    axios({
      method: "POST",
      url: "http://capstone-2-jf.herokuapp.com/api/displaycomments",
      data: {
        vid: vid,
      },
    })
      .then((res) => setHoldComments(res.data))
      .catch((err) => console.log(err));
  };

  const videoSrc = Logo;
  let navigate = useNavigate();

  const handleLogoutClick = () => {
    navigate("/");
    setIsLoggedIn(false);
    console.log(isLoggedIn);
  };

  return (
    <>
      <button className="videos-logout" onClick={() => handleLogoutClick()}>
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
          <div className="videos-downvote" onClick={() => downVote()}>
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
          <div className="videos-upvote" disabled onClick={() => upVote()}>
            <div className="arrow2"></div>
          </div>
        ) : (
          <div
            className="videos-upvote-after"
            disabled
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
              setIndex(index - 1);
              // previousClick();
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
              setIndex(index + 1);
              // nextVid();
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
              handleCommentsClick();
            }}
          >
            comments
          </div>
        ) : (
          <div
            className="comments-after"
            onClick={() => {
              setComments(!button);
            }}
          >
            comments
          </div>
        )}
        {openComments && (
          <form
            className="comments-box"
            onSubmit={(e) => handleCommentSubmit(e)}
          >
            {holdComments.map((object, index) => {
              return (
                <Component2
                  comment={object.comment}
                  username={object.username_id}
                  votes={object.votes}
                />
              );
            })}

            <input
              type="text"
              placeholder="add comment"
              className="comments-input"
              onChange={(e) => setUserComment(e.target.value)}
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
