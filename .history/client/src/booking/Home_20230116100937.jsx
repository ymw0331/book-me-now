import Jumbotron from '../components/cards/Jumbotron';
import { allHotels } from '../actions/hotel';
import { useState, useEffect } from 'react';
import SmallCard from '../components/cards/SmallCard';

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

  const handleHotelDelete = () =>
  {

  };

  return (
    (
      <>
        <Jumbotron title="All Hotels" />

        <div className='container-fluid'>
          <br />
          {/* <pre>{ JSON.stringify( hotels, null, 4 ) }</pre> */ }
          { hotels.map( ( h ) => <SmallCard key={ h._id } h={ h }  handleHotelDelete/> ) }
        </div>
      </>

    )
  );
};

export default Home;