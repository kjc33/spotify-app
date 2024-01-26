import React from "react";

function SearchForm({ searchKey, setSearchKey }) {
  return (
    <form onSubmit={searchArtists} id="search-form" className="artist-search flex">
      <input type="text" placeholder="Artist Name" name="search" className="search-query" id="search" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
      {searchKey && (
        <button type="button" className="clear-btn" onClick={() => setSearchKey("")}>
          X
        </button>
      )}
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
}

export default SearchForm;
