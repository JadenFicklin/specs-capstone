import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TopVideos.css";
import Logo from "../pictures/S.mp4";
import ReactPlayer from "react-player";
import axios from "axios";
import Component from "./Component";
import { useRecoilState } from "recoil";
import { usernameAtom } from "../atoms/global";

function TopVideos() {
  const [upload, setUpload] = useState(false);
  const [data, setData] = useState([]);

  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useRecoilState(usernameAtom);

  //7
  //get all videos
  useEffect(() => {
    axios.get("http://localhost:5000/api/topvideos").then((res) => {
      const sortData = res.data.sort(
        (a, b) => parseFloat(b.votes) - parseFloat(a.votes)
      );
      setData(sortData);
    });
  }, []);
  console.log(url, name, username);

  //delete videos that have -2 votes
  useEffect(() => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/deletevid",
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);

  //need videos url, name, votes and user that posted it
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
            <form
              className="upload-box"
              style={{ top: "138px" }}
              onSubmit={handleSubmit1}
            >
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
          <div className="top-logout" onClick={() => navigate("/")}>
            log out
          </div>
        </div>
        <div className="top-blue-background">
          <div className="top-three">
            <div className="inner-top-three">
              {data?.map((object, index) => {
                return (
                  <Component
                    objectUrl={object.url}
                    name={object.name}
                    votes={object.votes}
                    username={object.username}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopVideos;
