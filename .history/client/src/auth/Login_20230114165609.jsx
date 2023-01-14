import { useState } from "react";
import LoginForm from "../components/LoginForm";
import Jumbotron from "../components/cards/Jumbotron";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { login } from '../actions/auth';
import { useDispatch } from 'react-redux';


const Login = () =>
{
  const [ email, setEmail ] = useState( "ymw0331@gmail.com" );
  const [ password, setPassword ] = useState( "ymw0331" );
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    console.log( "SEND LOGIN DATA ===> ", { email, password } );

    try
    {
      const res = await login( {
        email,
        password,
      } );
      toast.success( "Login success. Please login" );

      if ( res.data ) //put into redux
      {
        console.log( `save user res in redux and local storage then redirect ==>` );
      }

      // save user and token to local storage
      window.localStorage.setItem( "auth", JSON.stringify( res.data ) );

      // save user and token to redux
      dispatch( {
        type: "LOGGED_IN_USER",
        payload: res.data
      } );
      navigate( "/das" );

    } catch ( err )
    {
      console.log( err );
      if ( err.response.status === 400 )
        toast.error( err.response.data );
    }
  };

  return (
    (
      <>
        <Jumbotron title="Login" />

        <div className='container'>
          <div className='row'>
            <div className='col-md-6 offset-md-3'>
              <LoginForm
                handleSubmit={ handleSubmit }
                email={ email }
                setEmail={ setEmail }
                password={ password }
                setPassword={ setPassword }
              />

            </div>
          </div>
        </div>

      </>
    )
  );
};


export default Login;