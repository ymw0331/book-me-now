import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { stripeSuccessRequest } from '../actions/stripe';
import Jumbotron from '../components/cards/Jumbotron';



const StripeCancel = () =>
{
  const { hotelId } = useParams();

  const { auth: { token } } = useSelector( ( state ) => ( { ...state } ) );
  // const { token } = auth;

  useEffect( () =>
  {
    // console.log( "send this hotelid to create order", hotelId );

    stripeSuccessRequest( token, hotelId )
      .then( res =>
      {
        console.log( "stripe success response", res.data );
      
      } );


  }, [ hotelId ] );


  return (
    <>
      <Jumbotron
        title={ `Payment Success: ${ hotelId }` }
      />
    </>
  );
};

export default StripeCancel;
