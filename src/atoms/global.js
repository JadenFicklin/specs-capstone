import { atom } from "recoil";

// export const usernameAtom = atom({
//   key: "username",
//   default: "",
// });

export const usernameAtom = atom({
  key: "username",
  default: "",
});

export const isLoggedInAtom = atom({
  key: "isLoggedIn",
  default: false,
});

export const vidAtom = atom({
  key: "vid",
  default: "",
});

// const [username, setUsername] = useRecoilState(usernameAtom);
