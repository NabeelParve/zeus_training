import React, { useEffect } from "react";
import Spinner from "./Spinner";
import { useData } from "../contexts/dataContext";
import { useLoading } from "../contexts/loadingContext";
import Table from "./Table";
import Pagination from "./Pagination";
import Searching from "./Searching";
import { useSort } from "../contexts/sortContext";

function Content() {
  const { data, setData } = useData();
  const { loading, setLoading } = useLoading();
  const {sort} = useSort()

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_no: 0,
        sort : sort.sort,
        search : sort.search
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setLoading(false);
        setData(data);
      }).catch(err => {
        console.log(err)
      });
  }, [sort,setData,setLoading]);

  return (
    <>
      {data.rows?.length > 0 ? (
        <>
          {!loading ? (
            <>
              <Searching /><Table /> <Pagination />
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
