import { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import axios from "axios";
import Jumbotron from "../components/cards/Jumbotron";

const Register = () =>
{
  const [ name, setName ] = useState( "ymw0331" );
  const [ email, setEmail ] = useState( "YMW0331@" );
  const [ password, setPassword ] = useState( "" );

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      const res = await axios.post( `http://localhost:8000/api/register`, {
        name,
        email,
        password,
      } );
      console.log( "REGISTER USER ===> ", res );
    } catch ( err )
    {
      console.log( err );
    }
  };

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
