import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [wantLimit, setWantLimit] = useState(0);
  const [spentData, setSpentData] = useState({ Need: 0, Want: 0 });

  return (
    <UserContext.Provider
      value={{ username, setUsername, wantLimit, setWantLimit, spentData, setSpentData }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
