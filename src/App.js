import React, {useState, useEffect} from 'react';
import './App.css';
import SearchBar from './components/SearchBar/SearchBar.js';
import SearchResults from './components/SearchResults/SearchResults.js';
import Playlist from './components/Playlist/Playlist.js';
// import SpotifyAPI from "./Spotify.js"; 

/* const tempHardcodedD = [
  {name: "Beautiful People", artist: "The Black Keys", album: "This is Nowhere", id: 1, uri: 1}, 
  {name: "City of Stars", artist: "Ryan Gosling", album: "La La Land", id: 2, uri: 2}, 
  {name: "A Lovely Night", artist: "Ryan Gosling, Emma Stone", album: "La La Land", id: 3, uri: 3}, 
  {name: "Autumn Leaves", artist: "Emmy Rossum", album: "Sentimental Journey", id: 4, uri: 4}, 
  {name: "Smile", artist: "Nat King Cole", album: "Ballads Of The Day", id: 5, uri: 5}, 
]
*/

function App() {

  const [searchResults, setSearchResults] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // API States

  const [hashIsPresent, setHashIsPresent] = useState(`${window.location.hash}`);
  const [tokenAndExpiry, setTokenAndExpiry] = useState([]);

  if (!hashIsPresent) {
    var url = 'https://accounts.spotify.com/authorize';
    var client_id = 'f346e3dbc48d4431bfe48a4f2cb7517f';
    var redirect_uri = 'https://simobecarevic.github.io/playlistize/';

    var scope = 'user-read-private user-read-email playlist-modify-private playlist-modify-public';
    var stateKey = String(Math.floor(Math.random()*1000));
    
    url += '?response_type=token';
    url += '&client_id=' + encodeURIComponent(client_id);
    url += '&scope=' + encodeURIComponent(scope);
    url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
    url += '&state=' + encodeURIComponent(stateKey);
    
    window.location.href = url; // reassigning or setting the value of window.location.href (not window.location.url, which is not a standard property) causes the web page to navigate to the new URL specified. This action effectively refreshes the page, as it unloads the current document, clears existing JavaScript state, and loads a new page from the specified URL. This behavior is similar to the user entering a new URL in the browser's address bar or clicking on a link.
  }
  
  useEffect(() => { 

    /* Fix bug of having to click "search" twice to search API bc URL get back from Spotify get the string of what comes after */
    const urlSubstrings = window.location.href.split('simobecarevic.github.io/playlistize/');
    console.log(urlSubstrings);
    const afterSlash = urlSubstrings[1];
    console.log(afterSlash, afterSlash[0]);

    // Inject the ? before the #, if it's not already there 
    if (afterSlash[0] !== '?') {
      const hashIndex = window.location.href.indexOf('#');
      window.location.href = window.location.href.slice(0, hashIndex) + '?' + window.location.href.slice(hashIndex);
    }

    /* Parse Token and Expires in from the URL sent back by Spotify */

    const hash = window.location.hash.substring(1); // remove # symbol
    const params = new URLSearchParams(hash);
    // Get the 'access_token' parameter
    console.log(params.get('access_token'), params.get('expires_in'));
    setTokenAndExpiry([params.get('access_token'), params.get('expires_in')]);
      /* window.location.hash=''; */  // This causes BUG, somehow values of token and expiresIn are lost; chatGPT says no hoisting but seems to be the case
    }, []); 

  async function searchSpotifyAPI() {
    
    let token = tokenAndExpiry[0]; 
    console.log(token);
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
          setSearchResults(jsonResponse.tracks.items);
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

  /* 

  Create a method that writes the user’s custom playlist in Jammming to their Spotify account. The user should be able to save their custom playlist from Jammming into their account when they click the “Save To Spotify” button.

  To implement this feature, you will need to make requests to create new playlists on the user’s Spotify account with the playlist’s custom name and add the tracks from the user’s custom playlist to the new playlist.

  To hit the necessary endpoints, you’ll need the user’s ID, you can make a request that returns the user’s Spotify username by making a request to https://api.spotify.com/v1/me.

  To create a new playlist, you will need to make a POST request to the /v1/users/{user_id}/playlists endpoint. You can set the name and description of the new playlist in the request body.

  To add tracks to the new playlist, you will need to make a POST request to the //v1/users/{user_id}/playlists/{playlist_id}/tracks endpoint. You can provide a list of track IDs in the request body to add them to the playlist.

  */

  async function saveToSpotify() {
    // Check if playlistName is not empty
    if (!playlistName) {
      return; 
    }
    // Check if there are songs in the playlist
    if (playlist.length === 0) {
      return; 
    }

    // Fetch the user ID
    try {
      const idResp = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + tokenAndExpiry[0]
        }
      })
      if (idResp.ok) {
        const idRespJson = await idResp.json(); // K* await is keyword here
        console.log(idResp);
        console.log(idRespJson);
        var user_id = idRespJson.id;
        console.log(user_id);
      }
    }
    catch (e) {
      console.log(e);
    }

    // Options Obj for next API request
    const createPlaylistOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + tokenAndExpiry[0],
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: playlistName,
        description: "Created using the Playlistify App",
        public: true,
        collaborative: false
      })
    };

    console.log(createPlaylistOptions);

    // Create new playlist via POST request
    try {
      console.log('TEST');
      const createPlaylist = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, createPlaylistOptions);
      console.log(createPlaylist);
      if (createPlaylist.ok) {
        const createPlaylistJSON = await createPlaylist.json();
        console.log(createPlaylistJSON);
        var playlistID = createPlaylistJSON.id; 
      } 
      else {
        console.error('Failed to create playlist:', createPlaylist.statusText);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
    }

    console.log(playlistID);
    
    // Create an array containing the URI of each track in the playlist; will use in adding them to created playlist
    const uriArr = [];
    for (let t of playlist) {
      uriArr.push(t.uri);
    }
    console.log(uriArr);

    // Add playlist TRACKs to created playlist
    try {
      const addPlaylistResp = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks
      `, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + tokenAndExpiry[0],
          "Content-Type": "appliation/json", 
        },
        body: JSON.stringify({
          uris: uriArr
        })
      })
      console.log(addPlaylistResp);
      if (addPlaylistResp.ok) {
        const addPlaylistRespJSON = await addPlaylistResp.json();
        console.log(addPlaylistRespJSON);
      }
    } catch(e) {
      console.log("Error creating playlist:", e);
    }

  
    // Reset the existing playlist on the web app
    setPlaylist([]);
    //Reset existing playlist Name
    setPlaylistName("");
  }

  return (
    <div className="App">

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} searchSpotifyAPI={searchSpotifyAPI} />

        <SearchResults searchResults={searchResults} setPlaylist={setPlaylist} addTrack={addTrack}/>
    
        <Playlist playlist={playlist} playlistName={playlistName} handlePlaylistNameChange={handlePlaylistNameChange} removeTrack={removeTrack} saveToSpotify={saveToSpotify}/>

    </div>
  );
}

export default App;

