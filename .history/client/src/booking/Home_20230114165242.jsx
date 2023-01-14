import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';

const Home = () =>
{
  const { user } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div className='container-fluid h-1 p-5 text-center'>
        <pre>
          Home Page { JSON.stringify( user ) }
        </pre>
      </div>
    )
  );
};


export default Home;