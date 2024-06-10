import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import Upload from "./components/Upload";

function App() {
  return (
    <div className="App px-2">
      <Navbar />
      <Upload />
      <hr />
      <Content />:
    </div>
  );
}

export default App;
