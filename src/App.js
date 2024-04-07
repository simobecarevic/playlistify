import React, {useState, useEffect} from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar.js';
import SearchResults from './components/SearchResults/SearchResults.js';
import Playlist from './components/Playlist/Playlist.js';
// import SpotifyAPI from "./Spotify.js"; 

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
  const [searchTerm, setSearchTerm] = useState("");
  // API States
  

  const [hashIsPresent, setHashIsPresent] = useState(`${window.location.hash}`);
  const [tokenAndExpiry, setTokenAndExpiry] = useState([]);

  console.log(hashIsPresent, tokenAndExpiry);
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
  
  useEffect(() => {
    const hash = window.location.hash.substring(1); // remove # symbol
    const params = new URLSearchParams(hash);
    // Get the 'access_token' parameter
    console.log(params.get('access_token'), params.get('expires_in'));
    setTokenAndExpiry([params.get('access_token'), params.get('expires_in')]);
/*     window.location.hash=''; */  // This causes BUG, somehow values of token and expiresIn are lost; chatGPT says no hoisting but seems to be the case
  }, [])

  console.log(tokenAndExpiry);

  async function searchSpotifyAPI(token, searchTerm, setSearchTerm) {
    
    let queryTerm = searchTerm.split(" ").join("%2520");
    const endpoint = `https://api.spotify.com/v1/search?q=${queryTerm}&type=track&limit=10`;
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
          setSearchTerm("");
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

        <SearchBar setSearchResults={setSearchResults} setSearchTerm={setSearchTerm} searchSpotifyAPI={searchSpotifyAPI} tokenAndExpiry={tokenAndExpiry} searchTerm={searchTerm}/>

        <SearchResults searchResults={tempHardcodedD} setPlaylist={setPlaylist} addTrack={addTrack}/>
    
        <Playlist playlist={playlist} playlistName={playlistName} handlePlaylistNameChange={handlePlaylistNameChange} removeTrack={removeTrack} saveToSpotify={saveToSpotify}/>

    </div>
  );
}

export default App;

