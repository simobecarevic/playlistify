import React, {useState, useEffect} from 'react';


export default function SearchBar (props) {
    const [searchTerm, setSearchTerm] = useState([]);
    

    const searchSpotifyAPI = () => {

    };

    return (
        <>
            <form onSubmit={searchSpotifyAPI}>
                <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                <button type="submit">Search</button>
            </form> 
        </>
    )
}