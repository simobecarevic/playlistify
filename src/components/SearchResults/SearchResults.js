import React, {useState, useEffect} from 'react';
import Tracklist from '../Tracklist/Tracklist.js';
import styles from './SearchResults.module.css';

export default function SearchResults (props) {

    return (
        <div className={styles.searchResults}> 
            <Tracklist tracks={props.searchResults} type="SearchResults" toggleTrack={props.addTrack}/>
        </div>
    );
}