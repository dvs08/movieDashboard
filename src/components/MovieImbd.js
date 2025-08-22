import React, {useEffect , useState} from 'react';
import MenuListTab from './MenuBar';
import BackDrop from './BackDrop';
import SearchMovie from './SearchMovie';
import MovieType from './MovieType';
import '../styles/movie.css';
import axios from 'axios';
import Footer from '../components/Footer';
import { Atom } from 'react-loading-indicators';


const MovieImbd = () => {

  const movieTypes = ['Trending Movies','Top-Rated Movies', 'Popular Movies', 'Upcoming Movies'];

  const [trend, setTrend] = useState([]);
  const [toprate, setToprate] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const [loading, setLoading] = useState(true);

  const topratingAPI = 'https://api.themoviedb.org/3/movie/top_rated?api_key=b4a0d0614148a4642609ef1707262164';
  const poplarAPI = 'https://api.themoviedb.org/3/movie/popular?api_key=b4a0d0614148a4642609ef1707262164';
  const trendAPI = 'https://api.themoviedb.org/3/movie/now_playing?api_key=b4a0d0614148a4642609ef1707262164';
  const upcomingAPI = 'https://api.themoviedb.org/3/movie/upcoming?api_key=b4a0d0614148a4642609ef1707262164';

  useEffect(() => {   
    const fetchData  = async () =>{

      try{

        setLoading(true);

        //Fetching data for Trending movies
        const trendResponse = await axios.get(trendAPI);      
        const trendMovies = trendResponse.data.results.map(movie =>({
          title: movie.title,
          backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`,
          movieId: movie.id
        }));
        setTrend(trendMovies);
      
        //Fetching data for TopRated movies
        const toprateResponse = await axios.get(topratingAPI);
        const toprateMovies = toprateResponse.data.results.map(movie => ({
          title: movie.title,
          movieId: movie.id,
          backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`
        }));
        setToprate(toprateMovies);
        // console.log("Top rated movies: ", toprateMovies);

        //Fetching data for Popular movies

        const popularResponse = await axios.get(poplarAPI);
        const popularMovies = popularResponse.data.results.map(movie => ({
          title: movie.title,
          movieId: movie.id,
          backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`: `https://the-movie-database-application.netlify.app/assets/no_image.jpg`
        }));
        setPopular(popularMovies)
        // console.log("Popular movies: ", popularMovies);

        const upcomingResponse = await axios.get(upcomingAPI);
        const upcomingMovies = upcomingResponse.data.results.map(movie => ({

          title: movie.title,
          movieId: movie.id,
          backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`
        }))
        setUpcoming(upcomingMovies);

      } catch(err){
        console.log("Error is,:", err);
      }finally{
        setLoading(false);
      }

    };
    fetchData();

  },[]);

   //Log the trend, popularmovies, toprate  whenever it updates
   useEffect(() => {
    console.log("Trend: ",trend); // This will log the updated trend array
  }, [trend]);

  useEffect(()=>{
    console.log("Top Rated: ", toprate);
  }, [toprate]);

  useEffect(() => {
    console.log("Popular: ", popular);
  }, [popular]);

  console.log(popular);

  return (
    <div>
        <MenuListTab/>
        <BackDrop/>
        <SearchMovie/>
        {loading ? (

            <div className='indic'> <Atom color="#3176cc" size="large" text="" textColor="#b70eb7"/></div>
        ):(

          movieTypes.map((type,index) => {
            let images, ids;
            if(type === 'Trending Movies') {
              images = trend.map(movie => movie.backdrop);
              ids = trend.map(movie => movie.movieId);
            }
            else if(type === 'Top-Rated Movies') {
              images = toprate.map(movie => movie.backdrop);
              ids = toprate.map(movie => movie.movieId);
  
            }
            else if(type === 'Popular Movies') {
              images = popular.map(movie => movie.backdrop);
              ids = popular.map(movie => movie.movieId);
  
  
            } else if(type === 'Upcoming Movies'){
              images = upcoming.map(movie => movie.backdrop);
              ids = upcoming.map(map => map.movieId);
            }
  
            return(
                <MovieType 
                  key ={index} 
                  movieType={type} 
                  movieImages={images}
                  movieIds = {ids}
                  
                  />
            );
          })
        )}
        <Footer/>
        
    </div>
  );
};

export default MovieImbd;
