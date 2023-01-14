import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ( { ...rest } ) =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );

if(!auth)

  return (

    auth && auth.token ? <Outlet { ...rest } /> : navigate( "/login" )

  );
};


export default PrivateRoute;