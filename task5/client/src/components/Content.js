import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";

function Content({ data, loading, setData, setLoading }) {
  useEffect(() => {}, [data]);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_no: 0,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setData(data);
      });
  }, []);

  return (
    <>
      {data.rows?.length > 0 ? (
        <>
          {!loading ? (
            <>
              <table className="table align-text-center mx-2">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Age</th>
                    <th scope="col">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows?.map((row) => (
                    <tr>
                      <th scope="row">{row[0]}</th>
                      <td>{row[1]}</td>
                      <td>{row[2]}</td>
                      <td>{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <Spinner />
          )}
        </>
      ) : (
        <h1>NO DATA</h1>
      )}
    </>
  );
}

export default Content;
