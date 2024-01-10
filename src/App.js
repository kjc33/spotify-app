import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import ArtistBio from "./components/ArtistBio";

import refreshAccessToken from "./utils/RefreshAccessToken";

function App() {

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [topTracks, setTopTracks] = useState([]);
  const [artistGenres, setArtistGenres] = useState("");
  const [artistFollowers, setArtistFollowers] = useState(0);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    setToken(token);
  }, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedToken = window.localStorage.getItem("token");
      const tokenExpirationTime = window.localStorage.getItem("tokenExpirationTime");
  
      if (storedToken && tokenExpirationTime) {
        const now = new Date().getTime();
        const expirationTime = parseInt(tokenExpirationTime, 10);
  
        const isTokenExpired = now > expirationTime;
  
        if (isTokenExpired) {
          refreshAccessToken(storedToken).then((newToken) => {
            setToken(newToken);
  
            // Update token expiration time in local storage
            const newExpirationTime = now + 3600; // Set the expiration duration in milliseconds
            window.localStorage.setItem("tokenExpirationTime", newExpirationTime.toString());
          }).catch((error) => {
            console.error('Failed to refresh access token:', error);
            // Handle error appropriately (e.g., redirect to login)
          });
        }
      }
    };
  
    // Call the checkTokenExpiration function
    checkTokenExpiration();
  }, []); // Add other dependencies as needed
  
  const logout = () => {
    setToken("");
    setSearchKey("");
    setArtists([]);
    setSearchSubmitted(false);
    window.localStorage.removeItem("token");
  };

  const clearSearch = () => {
    setSearchKey("");
    setSearchSubmitted(false);
  };

  const searchArtists = async (e) => {
    e.preventDefault();
    setSearchSubmitted(true);
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

        setArtists(data.artists.items);
      } else {
        setArtists([]);
      }
    } catch (error) {
      console.log("Error searching for artists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchArtistInfo = async () => {
      if (artists.length > 0) {
        try {
          const artistId = artists[0].id;
          const spotifyEndpoint = `https://api.spotify.com/v1/artists/${artistId}`;

          const { data } = await axios.get(spotifyEndpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const genres = data.genres || [];
          const followers = data.followers || {};

          setArtistGenres(capitalizeFirstLetter(genres.join(", ")));
          setArtistFollowers(followers.total || 0);
        } catch (error) {
          console.error("Error fetching artist info from Spotify:", error);
        }
      }
    };

    fetchArtistInfo();
  }, [artists, token]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (artists.length > 0) {
        try {
          const { data } = await axios.get(`https://api.spotify.com/v1/artists/${artists[0].id}/top-tracks`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              country: "US",
            },
          });

          setTopTracks(data.tracks);
        } catch (error) {
          console.log("Error fetching top tracks:", error);
        }
      }
    };

    fetchTopTracks();
  }, [artists, token]);

  const renderArtists = () => {
    if (!searchKey || (!searchSubmitted && artists.length === 0) || artists.length === 0) {
      return null;
    }

    if (artists.length === 0 && searchSubmitted) {
      return <p>Sorry, no artists found.</p>;
    }

    const artist = artists[0];

    if (artist.images.length === 0) {
      return (
        <div className="artist-not-found">
          <div className="no-artist-image">No Image</div>
          <div className="artist-name">{artist.name}</div>
        </div>
      );
    }

    return (
      <div className="artist" key={artist.id}>
        <div className="artist-image">
          <img width={"100%"} src={artist.images[0].url} alt="" />
        </div>
        <h2 className="artist-name">{artist.name}</h2>
        <p className="followers">
          <strong>Followers:</strong> {numberWithCommas(artistFollowers)}
        </p>
        <p className="genres">
          <strong>Genres:</strong> {artistGenres}
        </p>
        <h3 className="popular-songs">Popular Songs</h3>
        <div className="popular-songs-list">
          <ul>
            {topTracks.slice(0, Math.ceil(topTracks.length / 2)).map((track) => (
              <li key={track.id}>"{track.name}"</li>
            ))}
          </ul>
          <ul>
            {topTracks.slice(Math.ceil(topTracks.length / 2)).map((track) => (
              <li key={track.id}>"{track.name}"</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <main>
      {token && <button onClick={logout}>Logout</button>}
      <section className="artist-search">
        <h1>Artist Search</h1>
        {token ? (
          <form onSubmit={searchArtists} id="search-form">
            <div className="search-container">
              <input type="text" placeholder="Artist Name" name="search" id="search" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
              {searchKey && (
                <button type="button" onClick={clearSearch}>
                  X
                </button>
              )}
            </div>
            <button type="submit">Search</button>
          </form>
        ) : (
          <button onClick={() => (window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`)}>Login to Spotify</button>
        )}
      </section>
      <section className="search-results">
        {loading ? <p>Loading...</p> : null}
        {renderArtists()}
        {searchSubmitted && <ArtistBio searchKey={searchKey} />}
      </section>
    </main>
  );
}

export default App;