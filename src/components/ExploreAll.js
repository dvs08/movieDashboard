
//***MDS PAGINATION******* */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/allMovies.css';
import '../styles/movie.css';
import { Icon, Pagination , Paragraph, Heading } from '@innovaccer/design-system';
import "@innovaccer/design-system/css";
import MenuBar from './MenuBar';
import Footer from './Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { Atom } from 'react-loading-indicators';
import BackButton from './BackButton';

const ITEMS_PER_PAGE = 8;

const ExploreAll = () => {
    const { movieType } = useParams();
    const navigate = useNavigate();

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // State for loading

    // Fetch movies based on type
    useEffect(() => {
        const fetchData = async () => {
            let apiUrl = '';

            switch (movieType) {
                case 'trending-movies':
                    apiUrl = 'https://api.themoviedb.org/3/trending/movie/day?api_key=b4a0d0614148a4642609ef1707262164';
                    break;
                case 'top-rated-movies':
                    apiUrl = 'https://api.themoviedb.org/3/movie/top_rated?api_key=b4a0d0614148a4642609ef1707262164';
                    break;
                case 'popular-movies':
                    apiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=b4a0d0614148a4642609ef1707262164';
                    break;
                case 'upcoming-movies':
                    apiUrl = 'https://api.themoviedb.org/3/movie/upcoming?api_key=b4a0d0614148a4642609ef1707262164';
                    break;
                default:
                    setLoading(false);
                    return;
            }

            try {
                const response = await axios.get(apiUrl);
                console.log("Explore Response",response);
                const responseData = response.data.results.map(movie => ({
                    title: movie.title,
                    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`,
                    rating: movie.vote_average,
                    year: new Date(movie.release_date).getFullYear(),
                    id: movie.id
                }));
                console.log(responseData);
                setMovies(responseData);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchData();
    }, [movieType]);

    // Pagination logic
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = movies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {/* <MenuBar /> */}
            {/* <section>
                <div className="content">
                    <span>
                        <a className="home_link" onClick={() => navigate('/')}>HOME</a>
                    </span>
                    <span style={{ fontSize: "30px", marginLeft: "5px" }}>|</span>
                    <span style={{ marginLeft: "8px" }}>{movieType.replace('-', ' ').toUpperCase()}</span>
                </div>
            </section> */}
            <div className="container-fluid">
                <div className="row">
                    {loading ? ( // Show loader if loading
                        <div className='indic'> <Atom color="#3176cc" size="large" text="" textColor="#b70eb7"/></div>
                    ) : (
                        currentItems.map((movie, index) => (
                            <div key={index} className="col-md-3">
                                <div className="listing-item-style" onClick={() => navigate(`/movie/${movie.id}`, { state: { title: movie.title }})}>
                                    <img src={movie.backdrop} alt={movie.title} />
                                    <div className="movie-info">
                                        <p className="rate">
                                            <Icon size={18} name='star' type="outlined" appearance="warning" />
                                            <span>{movie.rating.toFixed(1)}</span>
                                        </p>
                                        <Paragraph color="white" className="year">{movie.year}</Paragraph>
                                        <Heading color="white" style={{display:"flex", marginLeft:"5px"}}>{movie.title}</Heading>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="pagination">
                <Pagination
                    type="basic"
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}

export default ExploreAll;


