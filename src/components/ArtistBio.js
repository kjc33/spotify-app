import React, { useState, useEffect } from "react";

const ArtistBio = (props) => {
  const [bio, setBio] = useState("Loading...");

  useEffect(() => {
    const apiUrl = 'https://en.wikipedia.org/w/api.php?';
    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      prop: 'extracts',
      exintro: true,
      explaintext: true,
      titles: props.searchKey,
      redirects: 1, // Handle redirects
      origin: '*'
    });

    fetch(`${apiUrl}${params}`)
      .then((response) => response.json())
      .then((data) => {
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== "-1" && pages[pageId].extract) {
          setBio(pages[pageId].extract);
        } else {
          setBio('Sorry, no biography found.');
        }
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setBio('Error fetching biography.');
      });
  }, [props.searchKey]); // Re-run effect if bandName changes

  return (
    <div className="artist-biography">
      <h3>Biography</h3>
      <p>{bio}</p>
    </div>
  );
};

export default ArtistBio;
