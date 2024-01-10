import React from "react";

const HeaderContent = ({ token, logout }) => {
  return (
    <div className="container">
      {token && <button onClick={logout}>Logout</button>}
    </div>
  );
};

export default HeaderContent;
