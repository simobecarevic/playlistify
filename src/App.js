import React, {useState, useEffect} from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar.js';
import SearchResults from './components/SearchResults/SearchResults.js';
import Playlist from './components/Playlist/Playlist.js';
import useSpotifyAPI from "./Spotify.js"; 

const tempHardcodedD = [
  {name: "Beautiful People", artist: "The Black Keys", album: "This is Nowhere", id: 1, uri: 1}, 
  {name: "City of Stars", artist: "Ryan Gosling", album: "La La Land", id: 2, uri: 2}, 
  {name: "A Lovely Night", artist: "Ryan Gosling, Emma Stone", album: "La La Land", id: 3, uri: 3}, 
  {name: "Autumn Leaves", artist: "Emmy Rossum", album: "Sentimental Journey", id: 4, uri: 4}, 
  {name: "Smile", artist: "Nat King Cole", album: "Ballads Of The Day", id: 5, uri: 5}, 
]

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [searchTerm, setSearchTerm] = useState([]);
  // API States

  console.log(window.location.hash);
  useEffect(() => {
    // If the logic that redirects the user to the Spotify authorization URL does not properly check if an access token already exists or if the current URL already includes an access token, it could continuously redirect the user, causing the app to reload endlessly. 
    // This fixed the bug of Endless Re-loading 
    if (!sessionStorage.getItem('token')) {
      var url = 'https://accounts.spotify.com/authorize';
      var client_id = 'f346e3dbc48d4431bfe48a4f2cb7517f';
      var redirect_uri = 'http://localhost:3000/';

      var state = Math.floor(Math.random()*1000);
      sessionStorage.setItem("stateKey", state);

      var scope = 'user-read-private user-read-email';
      
      url += '?response_type=token';
      url += '&client_id=' + encodeURIComponent(client_id);
      url += '&scope=' + encodeURIComponent(scope);
      url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
      url += '&state=' + encodeURIComponent(state);
      console.log('FIRST EFFECT'); // this does NOT show during 
      window.location.href = url; // reassigning or setting the value of window.location.href (not window.location.url, which is not a standard property) causes the web page to navigate to the new URL specified. This action effectively refreshes the page, as it unloads the current document, clears existing JavaScript state, and loads a new page from the specified URL. This behavior is similar to the user entering a new URL in the browser's address bar or clicking on a link.
      console.log(window.location); // THIS LINE of CODE is NEVER Reached! 
    }
    
    console.log(window.location); // URL & Location is localhost:3000/! not one set in previous effect, which means the CORS requirement of Spotify API, re-sets the window.location.url to this original/client URL. ChatGPT confirms that when this was second effect, it will NOT run on the first rendering, bc 1st/prior effect chgs location, ending execxn of JS incl-g this effect. SO TF, there is something inside this effect that is causing it to run twice. WRONG, put this code in 1st effet, and it is still running twice.
    console.log(window.location.hash);
    // Remove the '#' symbol
    const hash = window.location.hash.substring(1); 
    console.log(hash);
    const params = new URLSearchParams(hash);
    // Get the 'access_token' parameter
    const token = params.get('access_token'); 
    const expiresIn = params.get('expires_in');
    console.log(token);
    console.log(expiresIn);
    sessionStorage.setItem('token', token);
    console.log(sessionStorage, sessionStorage.getItem('token'));

    // Statement BELOW was CAUSING a BUG, For whatever reason it ERASES the token value inside sessionStorage; NOT Due to HOISTING, but presume it is due to assign a REF to SAME OBJ + console.log() calls are placed in a stack/queue and done at the end w final finals? 
    //window.location.hash = '';
  }, []); // the empty dependency arr won't stop the reloading bc changing window.location.href, and the Spotify API or WB re-sending us back to App URL (bc URI w access token already sent) is re-MOUNTING of resources

  /* // Moved code from this effect to first effect, but after the conditional that checks sessionStorage.getItem('token') and calls 
  useEffect(() => {
    
  }, []);  */
  
  async function searchSpotifyAPI(searchTerm, setSearchTerm) {
    const token = sessionStorage.getItem('token');
    console.log(sessionStorage);
    const endpoint = `https://api.spotify.com/v1/search?q=Cosmic%2520Love&type=track&limit=10`;
    try {
        console.log(token);
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            'Authorization': 'Bearer ' + token
          }
        })
        if (response.ok) {
          console.log(response);
          const jsonResponse = await response.json(); 
          console.log(jsonResponse);
        }
    }
    catch(e) {
      throw new Error(e); 
    }
  }
  
  function addTrack(track) {
    // Check if the track is already in the playlist state, if it is, do nothing
    for (let t of playlist) {
      if (t.id === track.id) {
        return
      }
    }
    // If track is not already in playlist state, update State
    setPlaylist(prev => [...prev, track]);
  }

  function removeTrack(track){
    // No need to check if track is in the playlist state, this function is only passed to <Playlist/> component, which only uses playlist state, & down to it's TrackList and Track cmpnts
    setPlaylist(prev => prev.filter(el => el.id !== track.id));
  }

  function handlePlaylistNameChange (e) {
    setPlaylistName(e.target.value)
  }

  function saveToSpotify() {
    // Check if playlistName is not empty
    // Check if there are songs in the playlist

    // create an array containing the uri of each track in the playlist.
    const uriArr = [];
    for (let t of playlist) {
      uriArr.push(t.uri);
    }
    console.log(uriArr);

    // Reset the existing playlist on the web app
    setPlaylist([]);
  }

  return (
    <div className="App">

        <SearchBar setSearchResults={setSearchResults} setSearchTerm={setSearchTerm} searchSpotifyAPI={searchSpotifyAPI} searchTerm={searchTerm}/>

        <SearchResults searchResults={tempHardcodedD} setPlaylist={setPlaylist} addTrack={addTrack}/>
    
        <Playlist playlist={playlist} playlistName={playlistName} handlePlaylistNameChange={handlePlaylistNameChange} removeTrack={removeTrack} saveToSpotify={saveToSpotify}/>

    </div>
  );
}

export default App;

