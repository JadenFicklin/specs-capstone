import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TopVideos.css";
import Logo from "../pictures/S.mp4";
import ReactPlayer from "react-player";
import axios from "axios";
import Component from "./Component";

function TopVideos() {
  const [upload, setUpload] = useState(false);
  const [data, setData] = useState("");
  const [vurls, setVurls] = useState([]);
  const [vnames, setVnames] = useState([]);
  const [vvotes, setVvotes] = useState([]);
  const [vusernames, setVusernames] = useState([]);
  //7
  //get all videos
  useEffect(() => {
    axios.get("http://localhost:5000/api/topvideos").then((res) => {
      const sortData = res.data.sort(
        (a, b) => parseFloat(b.votes) - parseFloat(a.votes)
      );

      const urls = [];
      for (let i = 0; i < sortData.length; i++) {
        urls.push(sortData[i].url);
      }
      const names = [];
      for (let a = 0; a < sortData.length; a++) {
        names.push(sortData[a].name);
      }
      const votes = [];
      for (let b = 0; b < sortData.length; b++) {
        votes.push(sortData[b].votes);
      }
      const usernames = [];
      for (let c = 0; c < sortData.length; c++) {
        usernames.push(sortData[c].username);
      }

      setVurls(urls);
      setVnames(names);
      setVvotes(votes);
      setVusernames(usernames);

      setData(sortData);
    });
  }, []);

  //need videos url, name, votes and user that posted it

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
            <div className="inner-top-three">
              {/* <div className="number-one">1</div> */}
              {/* <div className="number-two">2</div> */}
              {/* <div className="number-three">3</div> */}
              {/* {data.map((object, index) => {
                return (
                  <Component
                    objectUrl={object.url}
                    name={object.name}
                    votes={object.votes}
                    username={object.username}
                  />
                );
              })} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopVideos;
