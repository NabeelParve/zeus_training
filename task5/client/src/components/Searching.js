import React, { useState } from 'react'
import { useSort } from '../contexts/sortContext'

function Searching() {
    const { sort, setSort } = useSort()
    const [search, setSearch] = useState(sort.search)

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = document.getElementById('searchField').value
        setSearch(searchValue)
        setSort(prev => ({
            ...prev,
            search: searchValue
        }));
    }

    return (
        <form className='container-fluid'>
            <div className="row g-3">
                <div className="col">
                    <select className="form-select" aria-label="Default select example" onChange={(e) => {
                        setSort(prev => ({
                            ...prev,
                            sort: e.target.value
                        }));
                    }}>
                        <option defaultValue={true}>Sort by</option>
                        <option value="name">name</option>
                        <option value="email">email</option>
                        <option value="age">age</option>
                    </select>
                </div>
                <div className="col">
                    <input type="search" className="form-control" vaule={search} id='searchField' />

                </div>
                <div className='col'>
                    <button className='btn btn-success' onClick={handleSearch} >Search</button>
                </div>
            </div>
        </form>
    )
}

export default Searching