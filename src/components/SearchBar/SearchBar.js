export default function SearchBar (props) {
    
    return (
        <>
            <form onSubmit={() => props.searchSpotifyAPI(props.token, props.searchTerm, props.setSearchTerm)}>
                <input value={props.searchTerm} onChange={(e) => props.setSearchTerm(e.target.value)}/>
                <button type="submit">Search</button>
            </form> 
        </>
    )
}