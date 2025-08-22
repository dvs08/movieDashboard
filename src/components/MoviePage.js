
import React, { useEffect, useState } from 'react';
import bannerImage from '../images/MovieTest.jpg'; // Fallback image
import '../styles/movie.css';
import { Icon, Button, Modal, Heading, Text, Paragraph } from '@innovaccer/design-system';
import MenuBar from './MenuBar';
import Carousel from './Carousel';
import CarouselActor from './CarouselActor';
import Reviews from './Reviews';
import Footer from './Footer';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import CustomModal from './CustomModal';
import { Atom } from 'react-loading-indicators';
import "@innovaccer/design-system/css";

const MoviePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [movieDetails, setMovieDetails] = useState({});
    const [cast, setCast] = useState([]);
    const [recomMovie, setRecomMovie] = useState([]);
    const [review, setReview] = useState([]);
    const [youTube, setYoutube] = useState([]);


    const [modalOpen, setModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [loading, setLoading] = useState(true); // Loading state

    const castAPI = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=b4a0d0614148a4642609ef1707262164`;
    const recomMovieAPI = `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=b4a0d0614148a4642609ef1707262164`;
    const reviewAPI = `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=b4a0d0614148a4642609ef1707262164`;
    const movieDetailAPI = `https://api.themoviedb.org/3/movie/${id}?api_key=b4a0d0614148a4642609ef1707262164`;
    const youtubeAPI = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=b4a0d0614148a4642609ef1707262164`;

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true); // Set loading to true when starting to fetch
            try {
                // Fetch movie details
                const movieResponse = await axios.get(movieDetailAPI);

                const movieItems = {
                    title: movieResponse.data.title,
                    backdrop: movieResponse.data.backdrop_path? `https://image.tmdb.org/t/p/w500${movieResponse.data.backdrop_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`,
                    releaseDate: new Date(movieResponse.data.release_date).toLocaleDateString(),
                    budget: movieResponse.data.budget.toLocaleString(),
                    revenue: movieResponse.data.revenue.toLocaleString(),
                    languages: movieResponse.data.spoken_languages.map(lang => lang.name).join(', '),
                    genres: movieResponse.data.genres.map(genre => genre.name).join(', '),
                    overview: movieResponse.data.overview,
                    vote: movieResponse.data.vote_average,
                    voteCount: movieResponse.data.vote_count,
                    playtime: `${Math.floor(movieResponse.data.runtime / 60)}h ${Math.floor((movieResponse.data.runtime) % 60)}m`,
                    poster: movieResponse.data.poster_path ? `https://image.tmdb.org/t/p/w500${movieResponse.data.poster_path}` : 'https://the-movie-database-application.netlify.app/assets/no_image.jpg',
                    relStatus: movieResponse.data.status,
                };
                setMovieDetails(movieItems);

                //fetch YouTube Details

                const youtubeResponse = await axios.get(youtubeAPI);
                console.log("YT: ",youtubeResponse);
                const youTubedata = youtubeResponse.data.results.map(vid => ({
                    // name:vid.name,
                    key: vid.key
                }))

                
                setYoutube(youTubedata);
                console.log("YTDATA",youTubedata);
            
                // Fetch cast details
                const castResponse = await axios.get(castAPI);
                console.log(castResponse);
                const castProfiles = castResponse.data.cast.map(actor => ({
                    name: actor.name,
                    profile: actor.profile_path ?`https://image.tmdb.org/t/p/w500${actor.profile_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`,
                    id: actor.id
                }));
                setCast(castProfiles);
                console.log("Cast Profile",castProfiles);

                // Fetch recommended movies
                const recommenResponse = await axios.get(recomMovieAPI);
                const recommendations = recommenResponse.data.results.map(rec => ({
                    name: rec.title,
                    poster: rec.poster_path ? `https://image.tmdb.org/t/p/w500${rec.poster_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`,
                    id: rec.id
                }));
                setRecomMovie(recommendations);

                // Fetch reviews
                const reviewResponse = await axios.get(reviewAPI);
                const reviewData = reviewResponse.data.results.map(rev => ({
                    revText: rev.content,
                    author: rev.author,
                    date: new Date(rev.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    })
                }));
                setReview(reviewData);
            } catch (err) {
                console.log("Error:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchData();
    }, [id]);


    useEffect(() => {
        console.log("Youtube[]: ",youTube); 
        // console.log("Key", youTube[0].key);
    }, [youTube]);

    const handleWatchTrailer = () => {

        if(youTube.length > 0){
        
        setTrailerUrl(`https://www.youtube.com/embed/${youTube[0].key}?si=Tjac6J5E8fU63R0v`);
        setModalOpen(true);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    console.log("Cast[] length: ", cast.length);
    console.log("RecMov[]: ", recomMovie.length);
    return (
        <div>
            <MenuBar />
            <section>
                <div className="content">
                    <span>
                        <a className="home_link" onClick={() => navigate('/')}>HOME</a>
                    </span>
                    <span style={{ fontSize: "30px", marginLeft: "5px" }}>|</span>
                    <span style={{ marginLeft: "8px" }}>{movieDetails.title}</span>
                </div>
            </section>
            {loading ? ( 
                
                <div className='indic'> <Atom color="#3176cc" size="large" text="" textColor="#b70eb7"/></div>
            ) : (
                <div>
                    <div className="hero">
                        <div className="backdrop">
                            <div className="text-content">
                                <div className="name">{movieDetails.title}</div>
                                <div className="meta">
                                    <div className="info">
                                        <Icon size={23} name='star' appearance="warning" />
                                        <span className="rate2" style={{ color: "gold" }}>{movieDetails.vote}</span>
                                        <span>{movieDetails.voteCount} Reviews | {movieDetails.playtime}</span>
                                    </div>
                                </div>
                                <Paragraph color="white" className="desc" style={{ lineHeight: "2rem", marginTop:"2.5rem" }}>{movieDetails.overview}</Paragraph>
                                <br />
                                <Button size="regular" className="playTrailer" onClick={handleWatchTrailer}>Watch Trailer</Button>
                            </div>
                            <img
                                src={movieDetails.backdrop || bannerImage}
                                alt="Backdrop"
                                className="image"
                            />
                            <div className="overlay" />
                        </div>
                    </div>
                    <Heading size="xxl" className="text-center" style={{marginTop: "50px"}}>Overview</Heading>
                    <div className="main-container">
                        <div className="overview-container">
                            <div className="poster">
                                <img src={movieDetails.poster} width="350" height="500" alt="Poster" />
                            </div>
                            <div className="details">
                                <ul>
                                    <li><strong>Released:</strong> {movieDetails.releaseDate}</li>
                                    <li><strong>Runtime:</strong> {movieDetails.playtime}</li>
                                    <li><strong>Budget:</strong> ${movieDetails.budget}</li>
                                    <li><strong>Revenue:</strong> ${movieDetails.revenue}</li>
                                    <li><strong>Status:</strong> {movieDetails.relStatus}</li>
                                    <li><strong>Language:</strong> {movieDetails.languages}</li>
                                    <li><strong>Genre:</strong> {movieDetails.genres}</li>
                                </ul>
                            </div>
                        </div>

                        <Heading size="xxl"  style={{marginTop: "50px"}}className="text-center">Cast</Heading>
                        {
                            cast.length > 0 ? (

                                <CarouselActor images={cast.map(actor => actor.profile)} castIds={cast.map(cas => cas.id)} />

                            ) : (
                                <h2>No Cast Available</h2>
                            )
                        }
                       
                        <Heading size="xxl" style={{marginTop: "50px"}} className="text-center">Recommended Movies</Heading>
                        <Carousel images={recomMovie.map(rec => rec.poster)} movieIds={recomMovie.map(rec => rec.id)} />

                        <Heading size="xxl" style={{marginTop: "50px"}} className="text-center">Reviews</Heading>
                        {
                            review.length > 0 ? (
                                review.map((rev, index) => (
                                    <Reviews
                                        key={index}
                                        author={rev.author}
                                        revText={rev.revText}
                                        date={rev.date}
                                    />
                                ))
                            ) : (
                                <h2>No Reviews Available</h2>
                            )
                        }
                    </div>
                    <Footer />
                    <CustomModal isOpen={modalOpen} onClose={closeModal} videoUrl={trailerUrl} />
                </div>
            )}
        </div>
    );
};

export default MoviePage;




