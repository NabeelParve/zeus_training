import React from "react";
import { useData } from "../contexts/dataContext";
import { useLoading } from "../contexts/loadingContext";
import axios from "axios";


function Upload() {
  const { setData } = useData();
  const { setLoading } = useLoading();
  const handleUpload = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    const name = document.getElementById("csvfile").files[0].name;
    formData.append(
      "filename",
      name.substr(0, name.indexOf(".csv")) + Date.now() + ".csv"
    );
    formData.append("file", document.getElementById("csvfile").files[0]);
    console.log(...formData);
    axios.post("http://localhost:5000/upload", formData, {
      // onUploadProgress: (progress) => {
      //   const percentage = Math.ceil(progress.loaded / progress.total) * 100
      //   setProgress(percentage)
      // }
    })
      .then((data) => data.json())
      .then((response) => {
        setLoading(false);
        setData(response);
      })
      .catch((err) => {
        setData({
          rows: [],
          page_no: 1,
        });
        setLoading(false);
      });
  };

  return (
    <>
      <div className="input-group">
        <input type="file" className="form-control" name="file" id="csvfile" />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleUpload}
        >
          Upload
        </button>
      </div>
      
    </>
  );
}

export default Upload;
