import Jumbotron from '../components/cards/Jumbotron';
import { login } from '../actions/auth';
import LoginForm from './com'

const Login = () =>
{
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