import React,{ createContext, useContext, useState } from "react";

const dataContext = createContext({
    rows : [],
    page_no : 0
})


export const DataProvider = ({children}) =>{
    const [data, setData] = useState({
        rows: [],
        page_no: 0,
      });

      return (
        <dataContext.Provider value={{data , setData}}>
            {children}
        </dataContext.Provider>
      )
}


export const useData = ()=>{
    const {data, setData}  = useContext(dataContext)
    return {data, setData}
}