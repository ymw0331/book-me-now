import User from "../models/user";

export const createConnectAccount = async ( req, res ) =>
{
  //1. find user from db
  const user = await User.findById( req.user._id ).exec();
console.log()

  //2. if user don't have stripe_account_id yet, create new

  //3. create account link based on account id (for frontedn to complete onboarding)

  //4. update payment schedule (optional. default is 2 days)

};