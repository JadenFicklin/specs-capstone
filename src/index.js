import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

//added recoil
import { RecoilRoot } from "recoil";

ReactDOM.render(
  //added recoil (holds all other attributes/components)
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);

//recoil takes 5 steps

//step 1. npm i recoil

//step 2. wrap the index.js <App /> element in the recoil element
// import { RecoilRoot } from "recoil";
// <RecoilRoot>
// <App />
// </RecoilRoot>

//step 3. create a folder & file which will grab the values
// import { atom } from "recoil";
// export const usernameAtom = atom({
//   key: "username",                                               //this is like the variable name
//   default: "",                                                   //this is the default value
// });

//step 4. export those values from the source file
// import { usernameAtom } from "../atoms/global";
// import { useRecoilState } from "recoil";
// const [username, setUsername] = useRecoilState(usernameAtom);    //basically the same as useState

//step 5. import those values into needed file
// import { usernameAtom } from "../atoms/global";
// import { useRecoilState } from "recoil";
// const [username, setUsername] = useRecoilState(usernameAtom);
