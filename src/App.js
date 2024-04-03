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
    var url = 'https://accounts.spotify.com/authorize';
    var client_id = 'f346e3dbc48d4431bfe48a4f2cb7517f';
    var redirect_uri = 'http://localhost:3000/';

    var state = Math.floor(Math.random()*1000);
    localStorage.setItem("stateKey", state);

    var scope = 'user-read-private user-read-email';
    
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(state);

    window.location.href = url;
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');
  
    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      window.location.hash = '';
      window.sessionStorage.setItem('token', token);
    }
    // Now you can use the token to make requests to the Spotify API
  }, []);
  
  function searchSpotifyAPI () {

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

