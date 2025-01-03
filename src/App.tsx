import './App.css';
import { Outlet } from "react-router";
import NavBar from '@/components/NavBar';
import { useState, useEffect } from "react";

function App() {
  const [width, setWindowWidth] = useState(0);

  useEffect(() => {
    updateDimensions();

    window.addEventListener("resize", updateDimensions);
    return () =>
      window.removeEventListener("resize", updateDimensions);
  }, [])

  const updateDimensions = () => {
    setWindowWidth(width);
  }

  return <>
    <div className="App">
      <NavBar></NavBar>
      <div className="main">
        <Outlet />
      </div>
    </div>
  </>
}

export default App;
