import "./App.css";
import MainScreen from "./pages/MainScreens/MainScreen";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/AuthScreens/Auth";
import { useStateContext } from "./context/StateContext";

function App() {
  const { loading, isLogin } = useStateContext();

  return (
    <div className="App">
      {loading && (
        <div className="loading-screen">
          <div className="loader"></div>
        </div>
      )}
      <Router>
        <Routes>
          {isLogin ? (
            <Route path="/*" element={<MainScreen />} />
          ) : (
            <Route path="/*" element={<Auth />} />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
