export const createConnectAccount = async ( req, res ) =>
{
  // console.log( "REQ USER FROM REQUIRE_SIGNIN MIDDLEWARE", req.headers );
  // console.log( "YOU HIT CREATE CONNECT ACCOUNT END POINT" );
  //1. find user from db

  //2. if user don't have stripe_account_id yet, create new

  //3. create account link based on account id (for frontedn to complete onboarding)

  //4. update payment schedule (optional. default is 2 days)

};