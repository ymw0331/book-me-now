import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountStatus } from '../actions/stripe';
import { updateUserInLocalStorage } from '../actions/auth';
import Spinner from '../components/ui/Spinner';

const StripeCallback = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect( () =>
  {
    if ( auth && auth.token )
      accountStatus();
  }, [ auth ] );

  const accountStatus = async () =>
  {
    try
    {
      const res = await getAccountStatus( auth.token );
      // console.log( "USER ACCOUNT ON STRIPE CALLBACK", res );
      updateUserInLocalStorage( res.data, () =>
      {
        //update user in redux
        dispatch( {
          type: "LOGGED_IN_USER",
          paylaod: res.data
        } );
        //redirect user to dashboard
        // window.location.href = '/dashboard/seller';
        navigate( '/dashboard/seller' );
      } );

    } catch ( error )
    {
      console.log( error );
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className="text-center">
        <Spinner size="large" color="primary" className="mb-4" />
        <p className="text-gray-600">Connecting your Stripe account...</p>
      </div>
    </div>
  );
};

export default StripeCallback;