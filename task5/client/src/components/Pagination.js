import React from "react";
import { useData } from "../contexts/dataContext";
import { useLoading } from "../contexts/loadingContext";
import { useSort } from "../contexts/sortContext";

function Pagination() {
  const { data, setData } = useData();
  const { setLoading } = useLoading();
  const {sort} = useSort()

  const handlePagination = (i = 0) => {
    setLoading(true);
    fetch("http://localhost:5000/page", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page_no: data.page_no + i,
        sort : sort.sort,
        search : sort.search
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setData(data);
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
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${data.page_no === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={() => handlePagination(-2)}>
            Previous
          </button>
        </li>
        <li className="page-item active disabled">
          <button className="page-link" href="#">
            {data.page_no}
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={() => handlePagination(1)}>
            {data.page_no + 1}
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={() => handlePagination(2)}>
            {data.page_no + 2}
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={() => handlePagination()}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;