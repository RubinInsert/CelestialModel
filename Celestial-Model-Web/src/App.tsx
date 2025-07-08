import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import NavBar from "./components/NavBar.tsx";
import ThreeScene from "./components/ThreeScene";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="flex">
        <NavBar />
        <ThreeScene />
      </div>
    </>
  );
}

export default App;
