import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const PrivateRoute = ( { ...rest } ) =>
{

  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (

    auth && auth.toek

  );
};


export default PrivateRoute;