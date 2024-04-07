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

export default async function SpotifyApi(hashIsPresent) {
    console.log(hashIsPresent);
    
    if (!hashIsPresent) {
        
        var url = 'https://accounts.spotify.com/authorize';
        var client_id = 'f346e3dbc48d4431bfe48a4f2cb7517f';
        var redirect_uri = 'http://localhost:3000/';

        var scope = 'user-read-private user-read-email';
        var stateKey = String(Math.floor(Math.random()*1000));
        
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(client_id);
        url += '&scope=' + encodeURIComponent(scope);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(stateKey);
        
        window.location.href = url; // reassigning or setting the value of window.location.href (not window.location.url, which is not a standard property) causes the web page to navigate to the new URL specified. This action effectively refreshes the page, as it unloads the current document, clears existing JavaScript state, and loads a new page from the specified URL. This behavior is similar to the user entering a new URL in the browser's address bar or clicking on a link.
    }
    else { 
        const hash = window.location.hash.substring(1); // remove # symbol
        
        const params = new URLSearchParams(hash);
        // Get the 'access_token' parameter
        const token = params.get('access_token'); 
        const expiresIn = params.get('expires_in');

        window.location.hash = '';
        console.log(token, expiresIn);
        return [token, expiresIn];
    }
};
