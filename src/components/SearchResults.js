import React from "react";

const SearchResults = ({ loading, renderArtists, searchSubmitted, ArtistBio, searchKey }) => {
  return (
    <section className="search-results">
      {loading ? <p>Loading...</p> : null}
      {renderArtists()}
      {searchSubmitted && <ArtistBio searchKey={searchKey} />}
    </section>
  );
};

export default SearchResults;
