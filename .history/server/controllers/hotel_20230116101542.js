import fs from 'fs';
import Hotel from '../models/hotel';

export const create = async ( req, res ) =>
{
  // console.log( "req.fields", req.fields );
  // console.log( "req.files", req.files );
  try
  {
    let fields = req.fields;
    let files = req.files;

    let hotel = new Hotel( fields );
    //handle image
    if ( files.image )
    {
      hotel.image.data = fs.readFileSync( files.image.path );
      hotel.image.contentType = files.image.type;
    }

    hotel.save( ( error, result ) =>
    {
      if ( error )
      {
        console.log( 'saving hotel error =>', error );
        res.status( 400 ).send( "Error saving" );

      }
      res.json( result );
    } );
  }
  catch ( error )
  {
    console.log( error );
    res.status( 400 ).json( {
      error: error.message
    } );
  }

};

export const hotels = async ( req, res ) =>
{
  let all = await Hotel.find( {} )
    .limit( 24 )
    .select( '-image.data' )
    .populate( "postedBy", '_id name' )//show all the items instead of id only
    .exec();
  console.log( all );
  res.json( all );
};

export const image = async ( req, res ) =>
{
  let hotel = await Hotel.findById( req.params.hotelId ).exec();
};