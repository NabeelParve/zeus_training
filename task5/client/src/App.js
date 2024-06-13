import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Content from "./components/Content";
import Upload from "./components/Upload";
import { SortProvider } from "./contexts/sortContext";
import { DataProvider } from "./contexts/dataContext";
import { LoadingProvider } from "./contexts/loadingContext";

function App() {
  return (
    <div className="App px-2">
      <SortProvider>
        <DataProvider>
          <Navbar />
          <LoadingProvider>
            <Upload/>
            <hr />
            <Content/>
          </LoadingProvider>
        </DataProvider>
      </SortProvider>

    </div>
  );
}

export default App;
