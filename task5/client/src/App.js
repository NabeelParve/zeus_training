import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import Upload from "./components/Upload";
import { LoadingProvider } from "./contexts/loadingContext";
import { SortProvider } from "./contexts/sortContext";
import { DataProvider } from "./contexts/dataContext";

function App() {
  return (
    <div className="App px-2">
      <LoadingProvider>
        <SortProvider>
          <DataProvider>
          <Navbar />
          <Upload />
          <hr />
          <Content />
          </DataProvider>
        </SortProvider>
      </LoadingProvider>
    </div>
  );
}

export default App;
