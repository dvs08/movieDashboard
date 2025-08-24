import React, { useEffect, useState } from 'react';
import '../styles/movie.css';
import { HorizontalNav, Button, Icon } from '@innovaccer/design-system';
import "@innovaccer/design-system/css";
import axios from 'axios';
import { useNavigate, useParams, useLocation} from 'react-router-dom';
import BackButton from './BackButton';
//Re-rendering happens on unmout when Nagivation changes. in setState only state updates.
//Read about Lifecycle and useState rendering.

const Menubar = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [active, setActive] = useState({ name: 'home', label: 'Home' });
  const {menuname } = useParams();

  const titleFromState = location.state?.title || location.state?.name || location.state?.actorName;

  const fetchGenres = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list?api_key=b4a0d0614148a4642609ef1707262164');
      console.log("Response: ", response);
      
      const genres = response.data.genres.map(genre => ({
        name: genre.name.toLowerCase().replace(/\s+/g, '_'), 
        label: genre.name,
        id: genre.id
      }));

      // const homeTab = {name: 'home', label: 'Home', id:'home'};

      setData([{name: 'home', label: 'Home', id:'home'}, ...genres]);

    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    const path = location.pathname;

    if (path === '/') {
      setActive({ name: 'home', label: 'Home' });
    } else if (path.startsWith('/genres/')) {
      const parts = path.split('/');
      const genreName = parts[2];
      const matchedTab = data.find((item) => item.name === genreName);
      setActive(matchedTab || { name: genreName, label: genreName });
    } else if (path.startsWith('/movie/')) {
      // Use title from state if available
      setActive({
        name: titleFromState || 'Movie',
        label: titleFromState || 'Movie'
      });
    } else if (path.startsWith('/cast/')) {
      // Use actor name from state if available
      setActive({
        name: titleFromState || 'Actor',
        label: titleFromState || 'Actor'
      });
    }
      else if (path.startsWith('/explore/')) {
        const type = location.state?.name || decodeURIComponent(path.split('/')[2]);
        setActive({ name: type, label: type });
    }
      else if (path.startsWith('/search/')) {
        const searchQuery = location.state?.name || decodeURIComponent(path.split('/')[2]);
        setActive({ name: searchQuery, label: searchQuery});
    }
  }, [location.pathname, data, titleFromState]);

  const onClickHandler = ({ name, ...rest }) => {
    setActive({ name, label: rest.label || name });
    if (name === 'home') {
      navigate('/');
    } else {
      navigate(`/genres/${name}/${rest.id}`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
    <div className="d-flex justify-content-end py-6 bg-secondary-lightest navBackground" id='navBackground'>

      <HorizontalNav
        className="w-100 justify-content-end"
        menus={data}
        active={active}
        onClick={onClickHandler}
        
      />
    </div>
        {active.name !== 'home' && (
        <BackButton details={active.label} onBack={handleBack} />
      )}
    </div>
    
  );
};

export default Menubar;
