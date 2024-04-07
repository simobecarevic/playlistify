import React from 'react';
import styles from './Track.module.css';


export default function Track (props) {

    let buttonType;

    switch (props.type) {
        case "SearchResults":
            buttonType = "+";
            break; 
        case "Playlist":
            buttonType ="-";
            break;
        default: 
    }

    function printArtists (track) {
        let artists = ""
        for (let artist of track.artists) {
            artists += `${artist.name}, `;
        }
        return artists; 
    }

    return (
        <li className={styles.track} key={props.track.id}>
            <span>{props.track.name}</span><button className="trackButton" onClick={() => props.toggleTrack(props.track)}>{buttonType}</button>
            <p>{printArtists(props.track)}{props.track.album.name}</p>
        </li>
    )

}

