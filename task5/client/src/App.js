import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import Upload from "./components/Upload";
import Pagination from "./components/Pagination";

function App() {
  const [data, setData] = useState({
    rows: [],
    page_no: 1,
  });
  const [loading, setLoading] = useState("false")


  return (
    <div className="App px-2">
      <Navbar />
      <Upload setData={setData} setLoading={setLoading}/>
      <hr />
      <Content data={data} loading={loading} setData={setData} setLoading={setLoading}/>
      {data.rows?.length>0 && <Pagination data={data} setData={setData} loading={loading} setLoading={setLoading}/>}
    </div>
  );
}

export default App;
