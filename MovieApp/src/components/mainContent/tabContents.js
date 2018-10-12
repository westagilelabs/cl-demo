
import Listing from '../Listing/Listing';
import TopRated from '../Listing/TopRated';
import NowPlaying from '../Listing/NowPlaying';
import UpComing from '../Listing/Upcoming';

export var  tabContents = [
    {
        index : 1,
        icon : 'far fa-hand-spock',
        title : "Trending Movies",
        component : Listing
    },
    {
        index : 2,
        icon : 'far fa-star',
        title : "Top Rated",
        component : TopRated
    },
    {
        index : 3,
        icon : 'as fa-film',
        title : "Now Playing",
        component : NowPlaying
    },
    {
        index : 4,
        icon : 'fas fa-cloud-upload-alt',
        title : "Upcoming",
        component : UpComing
    }
]