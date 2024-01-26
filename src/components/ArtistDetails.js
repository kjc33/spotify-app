import React from 'react';
import ArtistBio from './ArtistBio';

function ArtistDetails({ artist, artistFollowers, artistGenres, topTracks }) {
 if (!artist || artist.images.length === 0) {
    return null;
 }

 const artistImage = artist.images[0].url;
 const artistName = artist.name;

 return (
    <article className="artist" key={artist.id}>
      <div className="container">
        <div className="artist-wrapper">
          <div className="artist-header flex flex-column">
            <div className="artist-header-left-col artist-profile-img">
              <div className="artist-image">
                <figure>
                 <img width={"100%"} src={artistImage} alt={artistName} />
                </figure>
              </div>
            </div>
            <div className="artist-header-right-col artist-profile-name">
              <div className="artist-name">
                <h2>{artistName}</h2>
              </div>
              <div className="followers">
                <p>{artistFollowers} Followers</p>
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
              <div className="back-to-top">
                <a href="#search">Back to Top</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
 );
}

export default ArtistDetails;