import React, { useState } from "react";
import { useSort } from "../contexts/sortContext";
import Swal from "sweetalert2";
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
});

function Bar() {
    const { sort, setSort } = useSort();
    const [search, setSearch] = useState(sort.search);

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = document.getElementById("searchField").value;
        setSearch(searchValue);
        setSort((prev) => ({
            ...prev,
            search: searchValue,
        }));
    };

    const handleInsert = async (event) => {
        event.preventDefault();
        const { value: formValues } = await Swal.fire({
            title: "Multiple inputs",
            html: `
          <input id="name" class="swal2-input" type="text" placeholder="Name" required>
          <input id="email" class="swal2-input" type="email" placeholder="Email" required>
          <input id="age" class="swal2-input" type="number" placeholder="Age" required>
          <input id="address" class="swal2-input" type="text" placeholder="Address" required>
        `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    document.getElementById("name").value,
                    document.getElementById("email").value,
                    document.getElementById("age").value,
                    document.getElementById("address").value,
                ];
            },
        });
        if (formValues) {
            try {
                var response = await fetch("http://localhost/edit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: formValues,
                })

                if (!response.ok) {
                    return Swal.showValidationMessage(`
                            ${JSON.stringify(response.json())}
                        `);
                }

                response = response.json()
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: response.message,
                    showConfirmButton: false,
                    timer: 1500
                });

            } catch (error) {
                Swal.showValidationMessage(`Request failed: ${error}`);
            }
        }
    };

    const handleDelete = (event) => {
        event.preventDefault();
        Swal.fire({
            title: "Enter your email",
            input: "email",
            inputAttributes: {
                autocapitalize: "off",
            },
            showCancelButton: true,
            confirmButtonText: "Delete",
            showLoaderOnConfirm: true,
            preConfirm: async (email) => {
                try {
                    const url = `
                  http://localhost:5000/edit
                `;
                    const response = await fetch(url, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                        }),
                    });
                    if (!response.ok) {
                        return Swal.showValidationMessage(`
                    ${JSON.stringify(await response.json())}
                  `);
                    }

                    return response.json();
                } catch (error) {
                    Swal.showValidationMessage(`
                  Request failed: ${error}
                `);
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                swalWithBootstrapButtons
                    .fire({
                        title: "Deleted!",
                        text: result.value.message,
                        icon: "success",
                    })
                    .then((data) => {
                        window.location.reload();
                    });
            }
        });
    };

    return (
        <form className="container">
            <div className="row g-3">
                <div className="col-3 justify-content-end">
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) => {
                            setSort((prev) => ({
                                ...prev,
                                sort: e.target.value,
                            }));
                        }}
                    >
                        <option>Sort by</option>
                        <option value="name">name</option>
                        <option value="email">email</option>
                        <option value="age">age</option>
                    </select>
                </div>
                <div className="col">
                    <input
                        type="search"
                        className="form-control"
                        vaule={search}
                        id="searchField"
                    />
                </div>
                <div className="col-1">
                    <button className="btn btn-dark" onClick={handleSearch}>
                        <i className="fa fa-search mr-1" aria-hidden="true"></i>
                        Search
                    </button>
                </div>
                <div className="col-1">
                    <button className="btn btn-success" onClick={handleInsert}>
                        Add/Update
                    </button>
                </div>
                <div className="col-1 ml-1">
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Bar;
