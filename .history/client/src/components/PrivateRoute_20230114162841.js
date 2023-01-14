import { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PrivateRoute = ( { ...rest } ) =>
{

  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (

    auth && auth.token ? <Route {...rest} /> : <Redirect to=""/>

  );
};


export default PrivateRoute;