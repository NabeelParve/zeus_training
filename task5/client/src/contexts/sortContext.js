import React,{ createContext, useContext, useState } from "react";

const sortContext = createContext(undefined)

export const SortProvider = ({children})=>{
    const [sort, setSort] = useState({sort : undefined , search : ""})
    return(
        <sortContext.Provider value={{sort , setSort}}>
            {children}
        </sortContext.Provider>
    )
}


export const useSort = ()=>{
    const {sort, setSort} = useContext(sortContext)
    return {sort, setSort}
}
