import { useState } from "react";
import Jumbotron from '../components/cards/Jumbotron';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import RegisterForm from '../components/RegisterForm';


export default function Register ()
{
  //state
  const [ name, setName ] = useState( 'ymw0331' );
  const [ email, setEmail ] = useState( 'ymw0331@gmail.com' );
  const [ password, setPassword ] = useState( 'ymw0331' );

  // console.log( process.env.REACT_APP_API );

  const handleSubmit = async ( e ) =>
  {
    e.preventDefault();
    try
    {
      console.table( { name, email, password } );
      // const { data } = await axios.post( `/register`,
      //   {
      //     name,
      //     email,
      //     password
      //   } );
      // console.log( data );

      // if ( data?.error )
      // {
      //   toast.error( data.error );
      // } else
      // {
      //   localStorage.setItem( 'auth', JSON.stringify( data ) );
      //   toast.success( "Registration successful" );
      // }

    } catch ( error )
    {
      console.log( error );
      toast.error( "Registration failed. Please try again" );
    }
  };



  return (
    <div>
      <Jumbotron title="Register" />
      <div className="container mt-5 ">
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <RegisterForm
              name={ name }
              email={ email }
              password={ password }
              setName={ setName }
              setEmail={ setEmail }
              setPassword={ setPassword }
              handleSubmit={ handleSubmit }
            />
          </div>
        </div>

      </div>


      {/* <pre>{ JSON.stringify( name, null, 4 ) }</pre>
      <pre>{ JSON.stringify( email, null, 4 ) }</pre>
      <pre>{ JSON.stringify( password, null, 4 ) }</pre> */}
    </div>
  );
}

