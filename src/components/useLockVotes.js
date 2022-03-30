export default {
  checkVotes: (name, vid, setAlreadyVoted) => {
    const lockedVotesStorage = localStorage.getItem("votesLocked");
    const lockedVotes = JSON.parse(lockedVotesStorage);

    const hasName = lockedVotes?.[name];
    if (hasName) {
      const alreadyVoted = lockedVotes[name].includes(vid);
      setAlreadyVoted(alreadyVoted);
    } else {
      setAlreadyVoted(false);
    }
  },
  lockVotes: (name, vid) => {
    const lockedVotesStorage = localStorage.getItem("votesLocked") || "{}";
    const lockedVotes = JSON.parse(lockedVotesStorage);

    const hasName = lockedVotes?.[name];
    !hasName && (lockedVotes[name] = []);

    lockedVotes[name].push(vid);

    localStorage.setItem("votesLocked", JSON.stringify(lockedVotes));
  },
  checkComments: () => {},
  lockComments: () => {},
};
