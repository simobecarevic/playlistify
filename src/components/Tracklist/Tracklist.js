import React from 'react';
import Track from '../Track/Track.js';
import styles from './Tracklist.module.css';

export default function Tracklist (props) {

    return (
        <ul className={styles.tracklist}>
            {props.tracks.map(track => <Track track={track} type={props.type} toggleTrack={props.toggleTrack}/>)}
        </ul>
    )
}