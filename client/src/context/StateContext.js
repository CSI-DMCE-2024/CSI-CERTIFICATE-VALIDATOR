import React, { useState, createContext, useEffect, useContext } from "react";
import axios from "axios";
import useEvents from "../hooks/Event";

const StateContext = createContext();

const StateProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("accessToken") ? true : false
  );
  const [loading, setLoading] = useState(false);
  const [fetchFlag, setFetchFlag] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  const toggleLoading = (state) => {
    setLoading(state);
  };

  const setToken = (newToken) => {
    localStorage.setItem("accessToken", newToken);
    setIsLogin(true);
  };

  const removeToken = () => {
    localStorage.removeItem("accessToken");
    setIsLogin(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
      setToken(accessToken);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      removeToken();
    }
  }, [isLogin]);

  const { events, DeleteOneEvent } = useEvents(
    isLogin,
    fetchFlag,
    removeToken,
    toggleLoading
  );

  const refreshFlag = () => {
    setFetchFlag((prev) => !prev);
  };

  const toggleMobileNav = (state) => {
    setMobileNav(state);
  };

  const positionOption = [
    { name: "Participant", value: "0" },
    { name: "Winner", value: "1" },
    { name: "1st Runner-Up", value: "2" },
    { name: "2nd Runner-Up", value: "3" },
  ];

  return (
    <StateContext.Provider
      value={{
        isLogin,
        loading,
        setToken,
        removeToken,
        events,
        refreshFlag,
        toggleMobileNav,
        mobileNav,
        toggleLoading,
        positionOption,
        DeleteOneEvent,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

export default StateProvider;
