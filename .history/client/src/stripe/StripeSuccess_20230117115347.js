import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { stripeSuccessRequest } from '../actions/stripe';
import Jumbotron from '../components/cards/Jumbotron';



const StripeCancel = () =>
{
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { auth: { token } } = useSelector( ( state ) => ( { ...state } ) );
  // const { token } = auth;

  useEffect( () =>
  {
    // console.log( "send this hotelid to create order", hotelId );

    stripeSuccessRequest( token, hotelId )
      .then( res =>
      {
if(res.data.success)

       
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
