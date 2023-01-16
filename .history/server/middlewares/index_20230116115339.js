import { expressjwt } from 'express-jwt';
import Hotel from '../models/hotel';

export const requireSignin = expressjwt( {
  //secret, expiryDate
  secret: process.env.JWT_SECRET,
  algorithms: [ "HS256" ],
} );

export const hotelOwner = async ( req, res, next ) =>
{
  let hotel = await Hotel.findById( req.params.id );

};