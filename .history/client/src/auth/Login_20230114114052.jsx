import Jumbotron from '../components/cards/Jumbotron';
import { login } from '../actions/auth';
import LoginForm from '../components/LoginForm';

const Login = () =>
{
  const [ email, setEmail ] = useState( "ymw0331@gmail.com" );
  const [ password, setPassword ] = useState( "ymw0331" );


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