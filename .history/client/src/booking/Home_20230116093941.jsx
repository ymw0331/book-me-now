import Jumbotron from '../components/cards/Jumbotron';
import { allHotels } from '../actions/hotel';
import { useState, useEffect } from 'react';


const Home = () =>
{

  const [ hotels, setHotels ] = useState( [] );
  useEffect( () =>
  {
    loadAllHotels();
  }, [] );


  return (
    (
      <div>
        <Jumbotron title="Home Page" />

      </div>
    )
  );
};

export default Home;