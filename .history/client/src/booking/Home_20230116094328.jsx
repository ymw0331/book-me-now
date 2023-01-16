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

  const loadAllHotels = async () =>
  {
    let res = await allHotels();
    setHotels( res.data );
  };

  return (
    (

      <>
        <Jumbotron title="All Hotels" />

        <div className='container-fluid'>
          {/* <pre>{ JSON.stringify( hotels, null, 4 ) }</pre> */ }
          { hotels.map( ( h ) => <SmallCard /> ) }
        </div>


      </>

    )
  );
};

export default Home;