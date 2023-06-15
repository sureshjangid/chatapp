import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Chats from "./page/Chats";

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chats" element={<Chats />} />
    </Routes>
    </div>
  );
}

export default App;
