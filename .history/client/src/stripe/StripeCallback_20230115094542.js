import { LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import 

const StripeCallback = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const dispatch = useDispatch();

  useEffect( () =>
  {
    if ( auth && auth.token )
  }, [ auth ] );


  return (
    <div className='d-flex justify-content-center p-5'>
      <LoadingOutlined className='display-1 p-5 text-danger' />
    </div>
  );
};

export default StripeCallback;