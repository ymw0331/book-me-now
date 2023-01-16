import Jumbotron from '../components/cards/Jumbotron';
import { useState } from "react";
import { toast } from "react-toastify";
import { read, updateHotel } from '../actions/hotel';
import { useSelector } from 'react-redux';
import HotelEditForm from '../components/forms/HotelEditForm';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useParams } from "react-router-dom";
import { useEffect } from 'react';


const EditHotel = () =>
{  // state
  const [ values, setValues ] = useState( {
    title: "",
    content: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  } );

  const [ preview, setPreview ] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );

  const [ location, setLocation ] = useState( "" );
  const [ coordinates, setCoordinates ] = useState(
    { lat: null, lng: null }
  );


  //redux
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const { token } = auth;

  useEffect( () =>
  {
    loadSellerHotel();
  }, [] );

  const { hotelId } = useParams();


  const loadSellerHotel = async () =>
  {
    console.log( hotelId );
    let res = await read( hotelId );
    console.log( res );
    setValues( { ...values, ...res.data } );
    setPreview( `${ process.env.REACT_APP_API }/hotel/image/${ res.data._id }` );
  };


  // destructuring variables from state
  const { title, content, image, price, from, to, bed } = values;

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    let hotelData = new FormData();
    hotelData.append( 'title', title );
    hotelData.append( 'content', content );
    hotelData.append( 'location', location );
    hotelData.append( 'price', price );
    image && hotelData.append( 'image', image );
    hotelData.append( 'from', from );
    hotelData.append( 'to', to );
    hotelData.append( 'bed', bed );

    console.log( [ ...hotelData ] );

    try
    {
      //use form data for file data (image)
      let res = await updateHotel( token, hotelData );
      console.log( "HOTEL UPDATE RES =>", res );
      toast.success( "hotel is posted" );
      setTimeout( () =>
      {
        //reload to clear fields
        window.location.reload();
      }, 1000 );
    } catch ( error )
    {
      console.log( error );
      toast.error( error.response.data );
    }

  };

  const handleImageChange = ( e ) =>
  {
    // console.log(e.target.files[0]);
    setPreview( URL.createObjectURL( e.target.files[ 0 ] ) );
    setValues( { ...values, image: e.target.files[ 0 ] } );
  };

  const handleChange = ( e ) =>
  {
    setValues( { ...values, [ e.target.name ]: e.target.value } );
  };

  const handleLocationSelect = async ( value ) =>
  {
    const results = await geocodeByAddress( value );
    const latLng = await getLatLng( results[ 0 ] );

    setLocation( value );
    setCoordinates( latLng );
    // console.log( results );
  };


  return (
    <>
      <Jumbotron
        title="Edit Hotel Page"
        subTitle={ `Hotel: ${ hotelId }` }
      />

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <br />
            {/* { hotelForm() } */ }

            <HotelEditForm
              handleSubmit={ handleSubmit }
              handleImageChange={ handleImageChange }
              handleChange={ handleChange }
              handleLocationSelect={ handleLocationSelect }
              title={ title }
              content={ content }
              location={ location }
              price={ price }
              values={ values }
              setLocation={ setLocation }
              setValues={ setValues }
            />

          </div>
          <div className="col-md-2">
            <img
              src={ preview }
              alt="preview_image"
              className="img img-fluid m-2"
            />
            <pre>{ JSON.stringify( values, null, 4 ) }</pre>
            { JSON.stringify( location ) }
          </div>
        </div>
      </div>

    </>
  );
};

export default EditHotel;
