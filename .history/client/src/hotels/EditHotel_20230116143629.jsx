import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DatePicker, Select } from "antd";
import { read } from "../actions/hotel";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Jumbotron from '../components/cards/Jumbotron';
import HotelEditForm from '../components/forms/HotelEditForm';

const { Option } = Select;


const EditHotel = () =>
{

  //redux
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const { token } = auth;

  const { hotelId } = useParams();
  useEffect( () =>
  {
    loadSellerHotel();
  }, [] );

  const loadSellerHotel = async () =>
  {
    console.log( hotelId );
    let res = await read( hotelId );
    console.log( res );
    setValues( { ...values, ...res.data } );
    setPreview( `${ process.env.REACT_APP_API }/hotel/image/${ res.data._id }` );
  };


  const [ values, setValues ] = useState( {
    title: "",
    content: "",
    image: "",
    price: "",
    from: "",
    to: "",
    bed: "",
  } );

  // destructuring variables from state
  const { title, content, image, price, from, to, bed } = values;


  const [ preview, setPreview ] = useState(
    "https://via.placeholder.com/100x100.png?text=PREVIEW"
  );


  const handleSubmit = async ( e ) =>
  {

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

  return (
    <>
      <Jumbotron
        title="Edit Hotel"
        subTitle={ `Hotel Id: ${ hotelId }` }
      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-10">
            <br />
            <HotelEditForm
              handleSubmit={ handleSubmit }
              handleImageChange={ handleImageChange }
              handleChange={ handleChange }
              title={ title }
              content={ content }
              price={ price }
              values={ values }
              setValues={ setValues }
            />          </div>
          <div className='col-md-2'>
            <img
              src={ preview }
              alt="preview_image"
              className='img img-fluid m-2'
            />
            <pre>{ JSON.stringify( values, null, 4 ) }</pre>

          </div>

        </div>
      </div>
    </>
  );
};

export default EditHotel;