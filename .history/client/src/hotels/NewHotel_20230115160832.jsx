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

  const handleChange = ( e ) =>
  {

  };

  const hotelForm = () => (
    <form onSubmit={ handleSubmit }>
      <div className='form-group'>
        <label className='btn btn-outline-secondary btn-block m-2 text-left'>
          Image
          <input type="file"
            name="image"
            onChange={ handleImageChange }
            accept="image/*"
            hidden
          />
        </label>
        <input type={}/>
      </div>

    </form>
  );


  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (

      <>
        <div>
          <Jumbotron title="Add Hotel" />
          <div className='container-fluid'>
            <div className='row'>
              <div className='col-md-10'>
                <br />
                { hotelForm() }
              </div>
              <div className='col-md-2'>Image</div>
            </div>
          </div>
        </div>
      </>

    )
  );
};


export default NewHotel;