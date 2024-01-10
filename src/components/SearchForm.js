// SearchForm.js
import React from "react";

const SearchForm = ({ token, searchArtists, searchKey, clearSearch, setSearchKey }) => {
  const CLIENT_ID = "2ee310db67664234992f32fce570ff74";
  const REDIRECT_URI = "http://localhost:3000";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  return (
    <section className="artist-search">
      <h1>Artist Search</h1>
      {token ? (
        <form onSubmit={searchArtists} id="search-form">
          <input type="text" placeholder="Artist Name" name="search" id="search" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
          {searchKey && (
            <button type="button" onClick={clearSearch}>
              X
            </button>
          )}
          <button type="submit">Search</button>
        </form>
      ) : (
        <button onClick={() => (window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`)}>Login to Spotify</button>
      )}
    </section>
  );
};

export default SearchForm;
