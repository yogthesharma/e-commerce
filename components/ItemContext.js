import React, { createContext, useEffect } from "react";

export const IdContext = createContext();

const ItemContext = ({ childern, idVal }) => {
  console.log(idVal);
  return <IdContext.Provider value={{ idVal }}>{childern}</IdContext.Provider>;
};

export default ItemContext;
