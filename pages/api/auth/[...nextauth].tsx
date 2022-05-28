import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scope =
  "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";

  
  async function refreshAccessToken(token) {
    try {
      const url =
        "https://accounts.spotify.com/api/token?" +
        new URLSearchParams({
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
        });

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          method: "POST",
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
          throw refreshedTokens;
        }

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
      } catch (error) {
        console.log(error);
    
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    }
    

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        params: { scope },
      },
    }),
  ],
 
  callbacks: {
    async jwt({ token, account ,user}) {
      if (account && user) {
        token.id = account.id;
        token.expires_at = account.expires_at;
        token.accessToken = account.access_token;
        
        
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      session.accessToken = token.accessToken;
      session.error = token.error;


      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});