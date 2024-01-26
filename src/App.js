import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

import ArtistDetails from "./components/ArtistDetails";
import Footer from "./components/Footer";
import Hero from "./Hero";
import Header from "./Header";

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

  const capitalizeFirstLetter = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const renderArtists = () => {
    if (!searchKey || artists.length === 0) {
      return null;
    }

    return <ArtistDetails artist={artists[0]} artistFollowers={artistFollowers} artistGenres={artistGenres} topTracks={topTracks} />;
  };

  return (
    <main>
      <Header token={token} logout={logout} />
      <Hero token={token} searchKey={searchKey} setSearchKey={setSearchKey} loading={loading} setLoading={setLoading} setArtists={setArtists} setShowMessage={setShowMessage} />
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
