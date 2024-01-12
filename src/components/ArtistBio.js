import React, { useState, useEffect } from "react";

const ArtistBio = (props) => {
  const [bio, setBio] = useState("Loading...");

  useEffect(() => {
    const fetchBio = async () => {
      const apiUrl = "https://en.wikipedia.org/w/api.php?";
      let searchParam = props.searchKey;
      
      const params = new URLSearchParams({
        action: "query",
        format: "json",
        prop: "extracts",
        exintro: true,
        explaintext: true,
        titles: searchParam,
        redirects: 1,
        origin: "*",
      });

      try {
        const response = await fetch(`${apiUrl}${params}`);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId !== "-1" && pages[pageId].extract) {
          setBio(pages[pageId].extract);
        } else {
          // Retry with " band" appended to the search parameter
          searchParam += " band";
          const retryParams = new URLSearchParams({
            action: "query",
            format: "json",
            prop: "extracts",
            exintro: true,
            explaintext: true,
            titles: searchParam,
            redirects: 1,
            origin: "*",
          });

          const retryResponse = await fetch(`${apiUrl}${retryParams}`);
          const retryData = await retryResponse.json();
          const retryPages = retryData.query.pages;
          const retryPageId = Object.keys(retryPages)[0];

          if (retryPageId !== "-1" && retryPages[retryPageId].extract) {
            setBio(retryPages[retryPageId].extract);
          } else {
            setBio("Sorry, no biography found.");
          }
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
        setBio("Error fetching biography.");
      }
    };

    fetchBio();
  }, [props.searchKey]);

  return (
    <>
      <h3>Biography</h3>
      <p>{bio}</p>
    </>
  );
};

export default ArtistBio;
