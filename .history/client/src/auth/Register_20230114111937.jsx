import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import axios from "axios";
import Jumbotron from "../components/cards/Jumbotron";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Register = () =>
{
  const [ name, setName ] = useState( "ymw0331" );
  const [ email, setEmail ] = useState( "ymw0331@gmail.com" );
  const [ password, setPassword ] = useState( "ymw0331" );

  const navigate = useNavigate();

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      const res = await axios.post( `${ process.env.RACT_APP_API }/register`, {
        name,
        email,
        password,
      } );
      toast.success( "Register success. Please login" );
      console.log( "REGISTER USER ===> ", res );
      navigate( "/login" );

    } catch ( err )
    {
      console.log( err );
      if ( err.response.status === 400 )
        toast.error( err.response.data );
    }
  };

  // console.log( process.env.REACT_APP_API );

  return (
    <>
      <Jumbotron title={ "Registration" } />

      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <RegisterForm
              handleSubmit={ handleSubmit }
              name={ name }
              setName={ setName }
              email={ email }
              setEmail={ setEmail }
              password={ password }
              setPassword={ setPassword }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
