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

    return (
        <li className={styles.track} key={props.track.id}>
            <span>{props.track.name}</span><button className="trackButton" onClick={() => props.toggleTrack(props.track)}>{buttonType}</button>
            <p>{`${props.track.artist}, ${props.track.album}`}</p>
        </li>
    )

}

