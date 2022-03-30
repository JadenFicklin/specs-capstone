import { atom } from "recoil";

// export const usernameAtom = atom({
//   key: "username",
//   default: "",
// });

export const usernameAtom = atom({
  key: "username",
  default: "f",
});

export const isLoggedInAtom = atom({
  key: "isLoggedIn",
  default: false,
});

export const accountCreatedAtom = atom({
  key: "accountCreated",
  default: false,
});

export const vidAtom = atom({
  key: "vid",
  default: "https://www.youtube.com/watch?v=km2OPUctni4",
});

// const [username, setUsername] = useRecoilState(usernameAtom);
