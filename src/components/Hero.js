import React from "react";
import SearchForm from "./components/SearchForm";
import CircleButton from "./components/CircleButton";
import axios from "axios";

const Hero = ({ token, searchKey, setSearchKey, loading, setLoading, setArtists, setShowMessage }) => {
  const CLIENT_ID = "2ee310db67664234992f32fce570ff74";
  const REDIRECT_URI = "https://spotify-artist-search-app.netlify.app/";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const searchArtists = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (searchKey.trim() !== "") {
        const { data } = await axios.get("https://api.spotify.com/v1/search", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: searchKey,
            type: "artist",
          },
        });

        if (data.artists.items.length === 0) {
          setShowMessage(true);
        } else {
          setShowMessage(false);
        }
        setArtists(data.artists.items);
      } else {
        setArtists([]);
        setShowMessage(false);
      }
    } catch (error) {
      console.log("Error searching for artists:", error);
      setArtists([]);
      setShowMessage(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search" id="search">
      <div className={`container container flex flex-column large-gap ${artists.length > 0 ? "search-results" : ""}`}>
        <h1 className="primary-heading">Artist Search</h1>
        <h2 className="primary-subhead">Get to know the artists you love.</h2>
        {token ? (
          <div className="artist-search-form">
            <SearchForm searchKey={searchKey} setSearchKey={setSearchKey} searchArtists={searchArtists} />
          </div>
        ) : (
          <CircleButton btnText="Login to Spotify Login to Spotify" onClick={() => (window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`)}></CircleButton>
        )}
        {loading ? <p>Loading...</p> : null}
      </div>
    </div>
  );
};

export default Hero;
