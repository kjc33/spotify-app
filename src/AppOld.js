import React, { useEffect } from "react";

const clientId = "2ee310db67664234992f32fce570ff74";
const redirectUri = "http://localhost:3000";

const scope = "user-read-private user-read-email";
const authUrl = new URL("https://accounts.spotify.com/authorize");

const App = () => {
  useEffect(() => {
    const initiateAuthorization = async () => {
      try {
        const codeVerifier = "b0eiUU9jWgDJ2P35FGAWoWZtxzc-LVv89eaX9DdN-OI"; // Replace with your actual code challenge value

        const sha256 = async (plain) => {
          const encoder = new TextEncoder();
          const data = encoder.encode(plain);
          const hashedBuffer = await crypto.subtle.digest("SHA-256", data);
          const hashedArray = Array.from(new Uint8Array(hashedBuffer));
          return hashedArray.map((byte) => String.fromCharCode(byte)).join("");
        };

        const base64encode = (input) => {
          const encoded = btoa(input);
          return encoded.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
        };

        const hashed = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashed);

        const params = new URLSearchParams({
          response_type: "code",
          client_id: clientId,
          scope,
          code_challenge_method: "S256",
          code_challenge: codeChallenge,
          redirect_uri: redirectUri,
        });

        authUrl.search = params.toString();
        window.location.href = authUrl.toString();
      } catch (error) {
        console.error("Error during authorization initiation:", error);
      }
    };

    initiateAuthorization(); // Call the async function immediately
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      // The user has granted access, and the authorization code is present
      // You can proceed to exchange the authorization code for an access token
      // getToken(code);
    }
  }, []); // Empty dependency array to run the effect only once

  return <div></div>;
};

export default App;
