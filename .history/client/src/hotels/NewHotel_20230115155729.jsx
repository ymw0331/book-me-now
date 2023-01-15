import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import { toast } from 'react-toastify';


const NewHotel = () =>
{
  const [ values, setValues ] = useState( {
title: '',
content: '',
location:'',
image:'',
price:'',
from:'',
to:''
  } );

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