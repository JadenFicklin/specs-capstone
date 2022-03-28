import React, { useState } from "react";
import ReactPlayer from "react-player";

function Component(props) {
  return (
    <div className="box">
      <>
        <span className="url-of-videos">
          <ReactPlayer
            url={
              `${props.objectUrl}` ||
              "https://www.youtube.com/watch?v=fe2KntKItaU"
            }
            light={true}
            // muted
            width={"280px"}
            height={"180px"}
          />
          <span className="name-of-videos">{props.name}</span>
        </span>
        <span className="username-of-videos">
          uploaded by: {props.username}
        </span>
        <span className="votes-of-videos">votes: {props.votes}</span>
      </>
    </div>
  );
}

export default Component;
