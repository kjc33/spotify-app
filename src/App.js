import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import ArtistBio from "./components/ArtistBio";
import CircleButton from "./components/CircleButton";
import Footer from "./components/Footer";

import Logo from "./media/artify-logo-dark.svg";

function App() {
 const CLIENT_ID = "2ee310db67664234992f32fce570ff74";
 const REDIRECT_URI = "https://spotify-artist-search-app.netlify.app/";
 const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
 const RESPONSE_TYPE = "token";

 const [token, setToken] = useState("");
 const [searchKey, setSearchKey] = useState("");
 const [artists, setArtists] = useState([]);
 const [loading, setLoading] = useState(false);
 const [topTracks, setTopTracks] = useState([]);
 const [artistGenres, setArtistGenres] = useState("");
 const [artistFollowers, setArtistFollowers] = useState(0);
 const [artistBio, setArtistBio] = useState("Loading...");
 const [showMessage, setShowMessage] = useState(false);

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

  const logout = () => {
    setToken("");
    setArtists([]);
    setSearchKey("");
    setShowMessage(false);
    window.localStorage.removeItem("token");
  };

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
          // Handle errors more effectively
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
          // Handle errors more effectively
        }
      }
    };

    fetchTopTracks();
  }, [artists, token]);

  useEffect(() => {
    const fetchArtistBio = async () => {
      if (searchKey.trim() !== "") {
        const apiUrl = "https://en.wikipedia.org/w/api.php?";
        const params = new URLSearchParams({
          action: "query",
          format: "json",
          prop: "extracts",
          exintro: true,
          explaintext: true,
          titles: searchKey,
          redirects: 1,
          origin: "*",
        });

        try {
          const response = await fetch(`${apiUrl}${params}`);
          const data = await response.json();
          const pages = data.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId !== "-1" && pages[pageId].extract) {
            setArtistBio(pages[pageId].extract);
          } else {
            setArtistBio("Sorry, no biography found.");
          }
        } catch (error) {
          console.error("Error fetching data: ", error);
          setArtistBio("Error fetching biography.");
        }
      }
    };

    fetchArtistBio();
  }, [searchKey]);

  const renderArtists = () => {
    if (!searchKey || artists.length === 0) {
      return null;
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
      <article className="artist" key={artist.id}>
        <div className="container">
          <div className="artist-wrapper">
            <div className="artist-header flex flex-column">
              <div className="artist-header-left-col artist-profile-img">
                <div className="artist-image">
                  <figure>
                    <img width={"100%"} src={artist.images[0].url} alt={artist.name} />
                  </figure>
                </div>
              </div>
              <div className="artist-header-right-col artist-profile-name">
                <div className="artist-name">
                  <h2>{artist.name}</h2>
                </div>
                <div className="followers">
                  <p>{numberWithCommas(artistFollowers)} Followers</p>
                </div>
              </div>
              <div className="artist-header-bottom artist-genres">
                <div className="genres">
                  <ul className="flex tiny-gap flex-wrap">
                    {artistGenres.split(",").map((genre, index) => (
                      <li key={index}>{genre.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="artist-body">
              <div className="line-divider"></div>
              <div className="biography">
              <ArtistBio bio={artistBio} setArtistBio={setArtistBio} artistName={searchKey} />
              </div>
              <div className="popular-songs">
                <h3>Popular Songs</h3>
                <div className="popular-songs-list">
                  <ul className="songs-list">
                    {topTracks.slice(0, 10).map((track, index) => (
                      <li key={track.id}>
                        <span className="track-number">{index + 1}</span>
                        <span className="track-name"> "{track.name}"</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="back-to-top"><a href="#search">Back to Top</a></div>
              </div>
            </div>
          </div>
        </div>
      </article>
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
      <header className="primary-header">
        <div className="container flex space-between extra-small-gap full-width">
          <div className="logo">
            <figure>
              <a href="/" rel="noopener">
                <img src={Logo} alt="Artify Logo" width="90" height="auto" />
              </a>
            </figure>
          </div>
          {token && (
            <button className="logout" id="logout" onClick={logout}>
              <span className="btn-text">Logout</span>
            </button>
          )}
        </div>
      </header>
      <div className="search" id="search">
        <div className={`container container flex flex-column large-gap ${artists.length > 0 ? "search-results" : ""}`}>
          <h1 className="primary-heading">Artist Search</h1>
          <h2 className="primary-subhead">Get to know the artists you love.</h2>
          {token ? (
            <div className="artist-search-form">
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
            </div>
          ) : (
            <CircleButton btnText="Login to Spotify Login to Spotify" onClick={() => (window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`)}></CircleButton>
          )}
          {loading ? <p>Loading...</p> : null}
        </div>
      </div>
      {renderArtists()}
      {showMessage && (
        <div className="container">
          <p>Sorry, no artists found.</p>
        </div>
      )}
      <Footer />
    </main>
  );
}

export default App;
