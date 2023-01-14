import Jumbotron from '../components/cards/Jumbotron';
import { login } from '../actions/auth';

const Login = () =>
{
  return (
    (
      <>
        <Jumbotron title="Login" />

        <div className='container'>
          <div className='row'>
            <div className='col-md-6 offset-md-'></div>

          </div>

        </div>


      </>
    )
  );
};


export default Login;