/* 
To use the Spotify API, you need to get a user’s Spotify access token to make Spotify API requests.

Create a JavaScript module (method) that will handle the logic for
- getting an (user's) access token (storing it) and 
- using it to make requests. 

Hints

- You can use the Implicit Grant Flow to set up a user’s account and make requests. 
    The implicit grant flow returns a user’s token in the URL.

- From the URL, you should extract the access token values and set them up in your app. 
- You should also set up a variable for the expiration time and configure the access token to expire at the appropriate time.

- Remember to clear parameters from the URL to avoid issues with expired access tokens.

- You may encounter errors if the access token is not in the URL. It can happen if the user has not logged in and granted your app access to their Spotify account yet. Handle these errors appropriately.

*/


export default function useSpotifyApi () {

};
