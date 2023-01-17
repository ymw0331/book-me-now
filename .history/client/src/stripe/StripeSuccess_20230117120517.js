import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { stripeSuccessRequest } from '../actions/stripe';
import Jumbotron from '../components/cards/Jumbotron';
import LoadingOutlined from '@ant-design/icons';


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
        if ( res.data.success )
        {
          // console.log( "stripe success response", res.data );
          navigate( "/dashboard" );
        } else
        {
          navigate( "/stripe/cancel" );
        }
      } );


  }, [ hotelId ] );


  return (
    <>
      <Jumbotron
        title={ `Payment Success` }
      />
      <div className='d-flex justify-content-center p'>
      <LoadingOutlined className='diplay-1 text-danger' />
      </div>
    </>
  );
};

export default StripeCancel;
