import Jumbotron from '../components/cards/Jumbotron';
import { login } from '../actions/auth';

const Login = () =>
{
  return (
    (
      <>
        <Jumbotron title="Login" />

        <div className='container'>
          <div className='row'></div>

        </div>


      </>
    )
  );
};


export default Login;