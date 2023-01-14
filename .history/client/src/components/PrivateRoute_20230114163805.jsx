import { Route, Redirect } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ( { ...rest } ) =>
{

  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const navigate = useNavigate();

  return (

    auth && auth.token ? <Outlet { ...rest } /> : navigate( "/login" )

  );
};


export default PrivateRoute;