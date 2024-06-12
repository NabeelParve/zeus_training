import React from "react";
import { useData } from "../contexts/dataContext";

function Table() {
  const { data } = useData();
  return (
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
          <tr key={row[4]}>
            <th scope="row">{row[0]}</th>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
            <td>{row[3]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
