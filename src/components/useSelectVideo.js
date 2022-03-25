const getNewRandomVideo = (remainingVideos) => {
  // select a random video
  const remainingVideosLength = remainingVideos.length;
  const randomIndex = Math.floor(Math.random() * remainingVideosLength);
  const randomVideo = remainingVideos[randomIndex];

  // remove the random video from the remaining videos
  remainingVideos.splice(randomIndex, 1);

  // return the random video
  return randomVideo;
};

const determineVideo = (remainingVideos, watchedVideos, setSelectedVideo) => {
  // get a new random video
  let randomVideo = getNewRandomVideo(remainingVideos);

  // check if all videos have already been watched
  const isOutOfVideos = !remainingVideos.length;
  if (isOutOfVideos) {
    setSelectedVideo(null);
    return;
  }

  // determine if the video has already been seen
  const alreadyWatched = watchedVideos.find((video) => video === randomVideo);

  // set the video if it hasn't been watched, otherwise search again
  alreadyWatched
    ? determineVideo(remainingVideos, watchedVideos, setSelectedVideo)
    : setSelectedVideo(randomVideo);
};

const useSelectVideo = () => (allVideos, watchedVideos, setSelectedVideo) => {
  // select a video
  let remainingVideos = [...allVideos];
  determineVideo(remainingVideos, watchedVideos, setSelectedVideo);
};

export default useSelectVideo;
