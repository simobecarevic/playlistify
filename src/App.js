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

      // This line alone was causing bug
      window.location.href = url;
    }
  }, []); // the empty dependency arr won't stop the reloading bc changing window.location.href, and the Spotify API or WB resending us back to App URL (bc URI w access token already sent) is re-MOUNTING of resources

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Remove the '#' symbol
    const params = new URLSearchParams(hash);
    const token = params.get('access_token'); // Get the 'access_token' parameter
    sessionStorage.setItem('token', token);
    window.location.hash = '';
  }, [])
  
  async function searchSpotifyAPI () {
      try {
        const token = sessionStorage.getItem('token');
        fetch( , {
          method: "GET"
        })
      }
      catch (e) {

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

        <SearchBar setSearchResults={setSearchResults} setSearchTerm={setSearchTerm} searchSpotifyAPI={searchSpotifyAPI}/>

        <SearchResults searchResults={tempHardcodedD} setPlaylist={setPlaylist} addTrack={addTrack}/>
    
        <Playlist playlist={playlist} playlistName={playlistName} handlePlaylistNameChange={handlePlaylistNameChange} removeTrack={removeTrack} saveToSpotify={saveToSpotify}/>

    </div>
  );
}

export default App;

