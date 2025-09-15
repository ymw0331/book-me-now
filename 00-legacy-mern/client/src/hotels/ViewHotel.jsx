import Jumbotron from '../components/cards/Jumbotron';
import React, { useState, useEffect } from "react";
import { Button } from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useStore } from "react-redux";
import { read, diffDays, isAlreadyBooked } from "../actions/hotel";
import moment from "moment";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { getSessionId } from '../actions/stripe';
import { loadStripe } from '@stripe/stripe-js';


const ViewHotel = () =>
{
  const [ hotel, setHotel ] = useState( {} );
  const [ image, setImage ] = useState( "" );
  const [ loading, setLoading ] = useState( false );
  const [ alreadyBooked, setAlreadyBooked ] = useState( false );

  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  const { hotelId } = useParams();
  const navigate = useNavigate();

  useEffect( () =>
  {
    if ( auth && auth.token )
    {
      isAlreadyBooked( auth.token, hotelId ).then( ( res ) =>
      {
        // console.log( res );
        if ( res.data.ok ) setAlreadyBooked( true );
      } );
    }
  }, [] );


  useEffect( () =>
  {
    loadSellerHotel();
  }, [] );

  const loadSellerHotel = async () =>
  {
    let res = await read( hotelId );
    // console.log( res );
    setHotel( res.data );
    setImage( `${ process.env.REACT_APP_API }/hotel/image/${ res.data._id }` );
  };

  const handleClick = async ( e ) =>
  {
    if ( !auth || !auth.token )
    {
      navigate( "/login" );
      return;
    }
    setLoading( true );
    e.preventDefault();
    if ( !auth ) navigate( "/login" );
    // console.log( "token ==>", auth.token );
    // console.log( "hotelId ==>", hotelId );


    let res = await getSessionId( auth.token, hotelId );
    // console.log( "get sessionId reaponse ==>", res.data.sessionId );
    const stripe = await loadStripe( process.env.REACT_APP_STRIPE_KEY_SG );
    stripe
      .redirectToCheckout( {
        sessionId: res.data.sessionId
      } )
      .then( ( result ) => console.log( result ) );
  };

  return (
    <>
      <Jumbotron
        title={ `${ hotel.title }` }

      />
      <div className="max-w-full px-4">
        <div className="flex flex-wrap -mx-2">
          <div className="w-full md:w-1/2 px-2">
            <br />
            <img src={ image } alt={ hotel.title } className="max-w-full h-auto rounded-lg shadow-md m-2" />
          </div>

          <div className="w-full md:w-1/2 px-2">
            <br />
            <b>{ hotel.content }</b>
            <Alert variant="info" className="mt-3">
              ${ hotel.price }
            </Alert>
            <p className="text-gray-700">
              <span className="float-end text-blue-600">
                for { diffDays( hotel.from, hotel.to ) }{ " " }
                { diffDays( hotel.from, hotel.to ) <= 1 ? " day" : " days" }
              </span>
            </p>
            <p>
              From <br />{ " " }
              { moment( new Date( hotel.from ) ).format( "MMMM Do YYYY, h:mm:ss a" ) }
            </p>
            <p>
              To <br />{ " " }
              { moment( new Date( hotel.to ) ).format( "MMMM Do YYYY, h:mm:ss a" ) }
            </p>
            <i>Posted by { hotel.postedBy && hotel.postedBy.name }</i>
            <br />
            <Button
              onClick={ handleClick }
              size="lg"
              className="w-full mt-3"
              disabled={ alreadyBooked }
              loading={ loading }
            >
              { alreadyBooked
                ? "Already Booked"
                : auth && auth.token
                  ? "Book Now"
                  : "Login to Book" }
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewHotel;
