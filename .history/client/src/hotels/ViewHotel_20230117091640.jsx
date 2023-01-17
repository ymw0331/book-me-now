import Jumbotron from '../components/cards/Jumbotron';
import React, { useState, useEffect } from "react";
import { useStore } from "react-redux";
import { read, diffDays } from "../actions/hotel";
import moment from "moment";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ViewHotel = () =>
{
  const [ hotel, setHotel ] = useState( {} );
  const [ image, setImage ] = useState( "" );

  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  const { hotelId } = useParams();
  const navigate = useNavigate();

  useEffect( () =>
  {
    loadSellerHotel();
  }, [] );

  const loadSellerHotel = async () =>
  {
    let res = await read( hotelId );
    // console.log(res);
    setHotel( res.data );
    setImage( `${ process.env.REACT_APP_API }/hotel/image/${ res.data._id }` );
  };

  const handleClick = ( e ) =>
  {
    e.preventDefault();
    if ( !auth ) navigate( "/login" );
    console.log( auth.token, hotelId );

    
  };

  return (
    <>
      <Jumbotron
        title={ `${ hotel.title }` }

      />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <br />
            <img src={ image } alt={ hotel.title } className="img img-fluid m-2" />
          </div>

          <div className="col-md-6">
            <br />
            <b>{ hotel.content }</b>
            <p className="alert alert-info mt-3">${ hotel.price }</p>
            <p className="card-text">
              <span className="float-right text-primary">
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
            <button
              onClick={ handleClick }
              className="btn btn-block btn-lg btn-primary mt-3"
            >
              { auth && auth.token ? "Book Now" : "Login to Book" }
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewHotel;
