import React from "react";

function Upload({ setData, setLoading }) {
  const handleUpload = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    const name = document.getElementById("csvfile").files[0].name;
    formData.append(
      "filename",
      name.substr(0, name.indexOf(".csv")) + Date.now() + ".csv"
    );
    formData.append("file", document.getElementById("csvfile").files[0]);
    console.log(...formData);
    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((data) => data.json())
      .then((response) => {
        setData((prev)=>({ ...prev , rows: response.data, page_no:1}));
        setLoading(false);
      });
  };

  return (
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
  );
}

export default Upload;
