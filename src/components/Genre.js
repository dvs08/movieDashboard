import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/allMovies.css';
import '../styles/movie.css';
import { Icon, Pagination } from '@innovaccer/design-system';
import MenuBar from './MenuBar';
import Footer from './Footer';
import { useParams, useNavigate } from 'react-router-dom';
import { Atom } from 'react-loading-indicators';
import BackButton from './BackButton';

const ITEMS_PER_PAGE = 8;

const GenreAll = () => {
    const {menuname , idTab } = useParams();
    const navigate = useNavigate();

    const [currData, setCurrData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const APIURL = `https://api.themoviedb.org/3/genre/${idTab}/movies?api_key=b4a0d0614148a4642609ef1707262164`;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(APIURL);
                
                const responseData = response.data.results.map(dat => ({
                    backdrop: dat.backdrop_path ? `https://image.tmdb.org/t/p/w500${dat.backdrop_path}` : `https://the-movie-database-application.netlify.app/assets/no_image.jpg`,
                    title: dat.title,
                    rating: dat.vote_average,
                    year: new Date(dat.release_date).getFullYear(),
                    id: dat.id, 
                }));

                setCurrData(responseData);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [idTab]); 

    

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = currData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(currData.length / ITEMS_PER_PAGE);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    console.log("CHECK MOVIE NAME", currData.title );
    return (
        <div>
            {/* <MenuBar /> */}
            {/* <section>
                <div className="content">
                    <span>
                        <a className="home_link" onClick={() => navigate('/')}>Hello</a>
                    </span>
                    <span style={{ fontSize: "30px", marginLeft: "5px" }}>|</span>
                    <span style={{ marginLeft: "8px" }}>{menuname.charAt(0).toUpperCase() + menuname.slice(1)}</span>
                </div>
            </section> */}
            <div className="container-fluid">
                <div className="row">
                    {loading ? (
                        <div className='indic'> <Atom color="#3176cc" size="large" text="" textColor="#b70eb7"/></div>
                    ) : (
                        currentItems.map(movie => (
                            <div key={movie.id} className="col-md-3">
                                <div className="listing-item-style" onClick={() => navigate(`/movie/${movie.id}`,{ state: { title: movie.title }})}>
                                    <img src={movie.backdrop} alt={movie.title} />
                                    <div className="movie-info">
                                        <p className="rate">
                                            <Icon size={18} name='star' type="outlined" appearance="warning" />
                                            <span>{movie.rating.toFixed(1)}</span>
                                        </p>
                                        <p className="year">{movie.year}</p>
                                        <h6>{movie.title}</h6>
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

export default GenreAll;



