import React from "react";

import GitHub from "../media/github-mark.svg";

const copyrightDate = new Date().getFullYear();

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-wrapper flex flex-row space-between flex-wrap extra-small-gap">
          <div className="footer-signature">
            &copy; {copyrightDate} Artify, Inc. All rights reserved.{" "}
            <a href="https://www.kylejohnchin.com/" target="_blank" rel="noreferrer" className="attribution">
              Website by Kyle Chin
            </a>
          </div>
          <div className="social">
            <div className="github flex">
              <a href="https://github.com/kjc33/spotify-app" target="_blank" rel="noreferrer">
                <img src={GitHub} alt="GitHub Icon" width="25" height="23" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
