import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Success from "./components/Success";
import Videos from "./components/Videos";
import TopVideos from "./components/TopVideos";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/success" className="success-page">
          success page
        </Link>
      </nav>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
