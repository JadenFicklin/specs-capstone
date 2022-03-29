import axios from "axios";
import React from "react";

function Component2(props) {
  const handleUpvoteClick = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/upvoteclick",
      data: {
        comment: props.comment,
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleDownvoteClick = () => {
    axios({
      method: "POST",
      url: "http://localhost:5000/api/downvoteclick",
      data: {
        comment: props.comment,
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="comments-small-box">
        <span className="commments-username">{props.username}: </span>
        <span className="commments-comment">{props.comment}</span>
        <span className="comments-votes">{props.votes}</span>
        <div className="upvt" onClick={handleUpvoteClick}></div>
        <div className="dnvt" onClick={handleDownvoteClick}></div>
      </div>
    </>
  );
}

export default Component2;
