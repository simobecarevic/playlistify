export default function SearchBar (props) {
    
    return (
        <>
            <form onSubmit={() => props.searchSpotifyAPI(props.tokenAndExpiry, props.searchTerm, props.setSearchResults)}>
                <input value={props.searchTerm} onChange={(e) => props.setSearchTerm(e.target.value)}/>
                <button type="submit">Search</button>
            </form> 
        </>
    )
}