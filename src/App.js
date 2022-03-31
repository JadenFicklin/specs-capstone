import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Success from "./components/Success";
import Videos from "./components/Videos";
import TopVideos from "./components/TopVideos";
import { isLoggedInAtom } from "./atoms/global";
import { useRecoilValue } from "recoil";

function App() {
  const isLoggedIn = useRecoilValue(isLoggedInAtom);

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route
              path="/"
              element={
                <>
                  <Register /> <Login />
                </>
              }
            />
            <Route path="/success" element={<Success />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/topvideos" element={<TopVideos />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <>
                  <Register /> <Login />
                </>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
