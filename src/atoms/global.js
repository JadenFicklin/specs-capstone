import { atom } from "recoil";

export const usernameAtom = atom({
  key: "username",
  default: "",
});

export const pastVideosAtom = atom({
  key: "password",
  default: [],
});

// const [username, setUsername] = useRecoilState(usernameAtom);
