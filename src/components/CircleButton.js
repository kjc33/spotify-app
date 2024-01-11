import React from "react";

export default function CircleButton({ btnText, onClick }) {
  return (
    <div className="circle-btn" onClick={onClick}>
      <svg viewBox="0 0 200 200" width="200" height="200" xmlns="http://www.w3.org/2000/svg" className="circle-btn-svg" aria-labelledby="circle-btn-title circle-btn-desc">
        <title id="circle-btn-title">Login to Spotify</title>
        <desc id="circle-btn-desc">A rotating link with text placed around a circle with an arrow inside</desc>

        <path id="circle-btn-destination" className="circle-btn-path" d="M 20, 100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" stroke="none" fill="none" />

        <path className="arrow" d="M 75 100 L 125 100 L 110 85 M 125 100 L 110 115" fill="none" />

        <text className="label">
          <textPath href="#circle-btn-destination" stroke="none">
            {btnText}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
