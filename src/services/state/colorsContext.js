import React, { createContext, useContext, useState, useEffect } from 'react';

export const ColorContext = createContext();

export const ColorContextProvider = ({ children }) => {
  const [state, setState] = useState({
    white: '#ffffff',
    black: '#000000',
    gray: '#808080',
    DarkGray: '#5a5a5a',
    lightGray: '#aaaaaa',
    theme: '#16a085',
    darkRed: '#A91E2F',
    error: '#ff2f47',
    disable: '#2C2C2C',
    InActive: '#555555',
    dull: '#1B1B1B',
    share: '#C1C1C1',
    description: '#D9D9D9',
    slideInActive: '#7C7C7C',
    copied: '#008B07',
    number: '#3A3939',
  });

  const setColor = (newColors) => {
    setState(prevState => ({
      ...prevState,
      ...newColors,
    }));
  };

  return (
    <ColorContext.Provider value={{ colors: state, setColor }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error('useColorContext must be used within a ColorContextProvider');
  }
  return context;
};
