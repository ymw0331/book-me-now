import { expressjwt } from 'express-jwt';
import Hotel from '../models/hotel';

export const requireSignin = expressjwt( {
  //secret, expiryDate
  secret: process.env.JWT_SECRET,
  algorithms: [ "HS256" ],
} );

