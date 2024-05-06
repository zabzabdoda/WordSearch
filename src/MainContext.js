import React from "react";

const defaultVal = { wordList: [], gridSize: 10, buttonRefs: [], grid: [] };
export const MainContext = React.createContext(defaultVal);