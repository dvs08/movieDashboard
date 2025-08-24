import React, {useState , useEffect} from 'react';
import { Icon, Button, Modal, Heading, Text, Paragraph } from '@innovaccer/design-system';
import "@innovaccer/design-system/css";
import '../styles/movie.css';
import MenuBar from './MenuBar';
import Footer from './Footer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Atom } from 'react-loading-indicators';
const Actors = () => {

    const {idActor} = useParams();
    console.log("ID ACTOR: ",idActor);
    const navigate = useNavigate();

    console.log("IdActor: ",idActor);
    const [actor, setActor] = useState(['']);
    const [loading, setLoading] = useState(true);
    

    const actorAPI = `https://api.themoviedb.org/3/person/${idActor}?api_key=b4a0d0614148a4642609ef1707262164`;

    useEffect(() => {
        if (!idActor) return;

        const fetchData = async () => {
            setLoading(true); // Set loading to true when starting to fetch
            try {
                // Fetch movie details
                const actorResponse = await axios.get(actorAPI);
                console.log("ActorResponse: ",actorResponse);
                console.log("ActorResponse.data: ", actorResponse.data);

                const actorData = {

                    name: actorResponse.data.name,
                    biography: actorResponse.data.biography,
                    profile:actorResponse.data.profile_path ? `https://image.tmdb.org/t/p/w500${actorResponse.data.profile_path}`: `https://the-movie-database-application.netlify.app/assets/no_image.jpg`
                }

                // console.log("ActorData: ", actorData);
                
                setActor(actorData);
                // console.log("Actor: ", actor);
                
            } catch (err) {
                console.log("Error:", err);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchData();
    }, [idActor]);

    useEffect(() => {
        console.log("Actor[]: ",actor); 
      
    }, [actor]);

    useEffect(()=>{
        console.log("ActorId: ", idActor);
    }, [idActor])

    return(
        <div>
            {/* <MenuBar/> */}
              {/* <section>
                <div className="content">
                    <span>
                        <a className="home_link" onClick={() => navigate('/')}>HOME</a>
                    </span>
                    <span style={{ fontSize: "30px", marginLeft: "5px" }}>|</span>
                    <span style={{ marginLeft: "8px" }}>{actor.name}</span>
                </div>
            </section> */}

            {loading ? (
                    
                    <div className='indic'> <Atom color="#3176cc" size="large" text="" textColor="#b70eb7"/></div>
            
            ) : (
                <div className="actors">
                
                <img className="actorImg" src={actor.profile}></img>

                <div className="actorDesc">
                    <Heading size="xl"style={{textAlign:"center", marginBottom:"30px"}}>{actor.name}</Heading>

                    {actor.biography ? (
                            <Paragraph>{actor.biography}</Paragraph>
                    ):(
                        <h5>No Information Available</h5>
                    )}
                    

                </div>
            </div>
               
            )}
        </div>
    );
}


export default Actors;