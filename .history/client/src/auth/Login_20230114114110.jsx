import Jumbotron from '../components/cards/Jumbotron';
import { login } from '../actions/auth';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

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
      const res = await register( {
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

  return (
    (
      <>
        <Jumbotron title="Login" />

        <div className='container'>
          <div className='row'>
            <div className='col-md-6 offset-md-3'>
              <LoginForm />

            </div>
          </div>
        </div>


      </>
    )
  );
};


export default Login;