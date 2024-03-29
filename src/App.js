import React, {useState, useEffect} from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar.js';
import SearchResults from './components/SearchResults/SearchResults.js';
import Playlist from './components/Playlist/Playlist.js';

const tempHardcodedD = [
  {name: "Beautiful People", artist: "The Black Keys", album: "This is Nowhere", id: 1}, 
  {name: "City of Stars", artist: "Ryan Gosling", album: "La La Land", id: 2}, 
  {name: "A Lovely Night", artist: "Ryan Gosling, Emma Stone", album: "La La Land", id: 3}, 
  {name: "Autumn Leaves", artist: "Emmy Rossum", album: "Sentimental Journey", id: 4}, 
  {name: "Smile", artist: "Nat King Cole", album: "Ballads Of The Day", id: 5}, 
]

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  
  function addTrack(track) {
    // Check if the track is already in the playlist state, if it is, do nothing
    for (let t of playlist) {
      console.log(t, t.id, track.id);
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
    // Check if there are songs in the playlist name
    
  }

  return (
    <div className="App">

        <SearchBar setSearchResults={setSearchResults}/>

        <SearchResults searchResults={tempHardcodedD} setPlaylist={setPlaylist} addTrack={addTrack}/>
    
        <Playlist playlist={playlist} playlistName={playlistName} handlePlaylistNameChange={handlePlaylistNameChange} removeTrack={removeTrack} saveToSpotify={saveToSpotify}/>

    </div>
  );
}

export default App;

