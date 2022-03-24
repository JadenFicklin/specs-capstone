// movies database [1,2,3,4,5,6,7,8,9,10]
// grab random number
// => 4
const currentVideo = 4;
const watchedVideos = [1, 2, 3, 5];

const found = watchedVideos.find((element) => element === currentVideo);

if (found) {
  console.log("you have already watched this video");
  // make a new random number and try again
} else {
  console.log("you have NOT watched this video yet");
  // add the current number to the watched videos
  // update the watched videos in the database for the user
}

console.log(found);
// expected output: 12
