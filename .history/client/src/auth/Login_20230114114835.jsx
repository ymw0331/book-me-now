import { useState } from "react";
import LoginForm from "../components/LoginForm";
import Jumbotron from "../components/cards/Jumbotron";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { login } from '../actions/auth';


const Login = () =>
{
  const [ email, setEmail ] = useState( "ymw0331@gmail.com" );
  const [ password, setPassword ] = useState( "ymw0331" );
  const navigate = useNavigate();

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      const res = await login( {
        email,
        password,
      } );
      toast.success( "Login success. Please login" );
      console.log( "LOGIN USER ===> ", res );

      if ( res.data )
      {
        console.log( `save user res in redux and local storage then redirect ==>` );
      }

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