import React,{ createContext, useContext, useState } from "react";

const loadingContext = createContext(false);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <loadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </loadingContext.Provider>
  );
};

export const useLoading = ()=>{
    const{loading, setLoading} = useContext(loadingContext)
    return {loading, setLoading}
}
