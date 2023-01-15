import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountStatus } from '../actions/stripe';
import { updateUserInLocalStorage } from '../actions/auth';

const StripeCallback = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const dispatch = useDispatch();

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
        dispatch()
      } );

    } catch ( error )
    {
      console.log( error );
    }
  };

  return (
    <div className='d-flex justify-content-center p-5'>
      <LoadingOutlined className='display-1 p-5 text-danger' />
    </div>
  );
};

export default StripeCallback;