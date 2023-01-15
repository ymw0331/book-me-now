import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import { toast } from 'react-toastify';


const NewHotel = () =>
{
  //state
  const [ values, setValues ] = useState( {
    title: '',
    content: '',
    location: '',
    image: '',
    price: '',
    from: '',
    to: '',
    bed: ''
  } );

  //destructuring varialbes from state
  const { title, content, location, image, price, from, to, bed } = values;

  const handleSubmit = ( e ) =>
  {

  };


  const handleImageChange = ( e ) =>
  {

  };

  const handleChange = (e) =>{
    
  }

  const hotlForm = () => (
    <form onSubmit={ handleSubmit }>

    </form>
  );


  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div>
        <Jumbotron title="Post a new hotel" />
        <pre>{ JSON.stringify( auth ) }</pre>

      </div>
    )
  );
};


export default NewHotel;