import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {Navigate}

const PrivateRoute = ( { ...rest } ) =>
{

  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const navigate = useNavigate();

  return (

    auth && auth.token ? <Outlet { ...rest } /> : navigate( "/login" )

  );
};


export default PrivateRoute;