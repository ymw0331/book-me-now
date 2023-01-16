import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DatePicker, Select } from "antd";
import { read } from "../actions/hotel";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Jumbotron from '../components/cards/Jumbotron';

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

  const loadSellerHotel = async () =>
  {
    console.log( hotelId );
    let res = await read( hotelId );
    console.log( res );
  };

  const handleSubmit = async (e) =>
  {

  };



  return (
    <>
      <Jumbotron
        title="Edit Hotel"
        subTitle={ `Hotel Id: ${ hotelId }` }
      />

    </>
  );
};

export default EditHotel;