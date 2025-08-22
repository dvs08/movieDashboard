import React, { useEffect, useState } from 'react';
import '../styles/movie.css';
import { HorizontalNav } from '@innovaccer/design-system';
import "@innovaccer/design-system/css";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

//Re-rendering happens on unmout when Nagivation changes. in setState only state updates.
//Read about Lifecycle and useState rendering.

const Menubar = () => {

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [active, setActive] = useState();

  // console.log("Before Ac:", active);
  const {menuname } = useParams();


  useEffect(()=>{
    setActive( {name: menuname || 'home'})

  },[menuname])


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
      

      console.log("Genres: " , genres);
      // setData(genres);
     
      // setActive(genres[0]); 


    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);


  const onClickHandler = ({name, ...rest}) => {
    console.log('menu-clicked: ', name);
    setActive({name});
    console.log("menu name Set",name);
    if(name === 'home'){
      navigate('/');
    } else {
    navigate(`/genres/${name}/${rest.id}`);
    }
  };


  // console.log("Data.id: ", active.id);
  console.log("Data: ", data);
  console.log("Active:", active);

  return (
    <div className="d-flex justify-content-end py-6 bg-secondary-lightest navBackground" id='navBackground'>
      <HorizontalNav
        className="w-100 justify-content-end"
        menus={data}
        active={active}
        onClick={onClickHandler}
        
      />
    </div>
  );
};

export default Menubar;
