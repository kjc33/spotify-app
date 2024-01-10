import axios from 'axios';

const refreshAccessToken = (token, setToken) => {
  // Replace the following lines with your Spotify client ID and client secret
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

  // Encode the client ID and client secret for Basic Authorization
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  // Set up headers for the HTTP request
  const config = {
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // Set up data for the refresh token request
  const data = new URLSearchParams();
  data.append('grant_type', 'refresh_token');
  data.append('refresh_token', token);

  // Send the refresh token request to the Spotify API
  return axios
    .post('https://accounts.spotify.com/api/token', data, config)
    .then((response) => {
      // Extract the new access token from the response
      const newToken = response.data.access_token;
      return newToken;
    })
    .catch((error) => {
      // Handle errors related to refreshing the access token
      console.error('Failed to refresh access token:', error);
      throw error;
    });
};

export default refreshAccessToken;
