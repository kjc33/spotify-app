// Header.js
import React, { useEffect, useState } from "react";
import HeaderContent from "./HeaderContent";

const Header = ({ setSearchKey, setArtists, setSearchSubmitted }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    setSearchKey("");
    setArtists([]);
    setSearchSubmitted(false);
    window.localStorage.removeItem("token");
  };

  return (
    <header>
      <HeaderContent token={token} logout={logout} />
    </header>
  );
};

export default Header;
