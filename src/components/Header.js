import React from "react";
import Logo from "../media/artify-logo-dark.svg";

const Header = ({ token, logout }) => {
  return (
    <header className="primary-header">
      <div className="container flex space-between extra-small-gap full-width">
        <div className="logo">
          <figure>
            <a href="/" rel="noopener">
              <img src={Logo} alt="Artify Logo" width="90" height="auto" />
            </a>
          </figure>
        </div>
        {token && (
          <button className="logout" id="logout" onClick={logout}>
            <span className="btn-text">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
