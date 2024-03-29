import React, {useState, useEffect} from 'react';
import Tracklist from '../Tracklist/Tracklist.js';
import styles from './Playlist.module.css';


export default function Playlist (props) {
    return (
        <div className={styles.playlist}>
            <input value={props.playlistName} onChange={props.handlePlaylistNameChange}/>
        
            <Tracklist tracks={props.playlist} type="Playlist" toggleTrack={props.removeTrack}/>
        
            <button onClick={props.saveToSpotify}>Save to Spotify</button>
        </div>    
    ); 
    
}