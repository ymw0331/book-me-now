import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ( { ...rest } ) =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  if ( !auth )
  {
    return <Navigate to="/login" />;
  }

  return (


  );
};


export default PrivateRoute;