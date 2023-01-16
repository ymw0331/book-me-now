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


  const loadSellerHotel = async () =>
  {
    console.log( hotelId );
    let res = await read( hotelId );
    console.log( res );
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