import React from "react";

const copyrightDate = new Date().getFullYear();

export default function Footer() {
  return (
    <footer>
      <div className="container flex flex-column large-gap">
        <div className="footer-wrapper">
          <div className="footer-signature">
            &copy; {copyrightDate} Artify, Inc. All rights reserved.<span className="pipe">|</span> <a href="https://www.kylejohnchin.com/" target="_blank" rel="noopener" className="attribution">Website by Kyle Chin</a>
          </div>
          <div className="social">

          </div>
        </div>
      </div>
    </footer>
  );
}
