import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [idutilizador, setIdutilizador] = useState(null);

  return (
    <UserContext.Provider value={{ idutilizador, setIdutilizador }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
