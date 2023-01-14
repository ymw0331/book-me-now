import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';

const Home = () =>
{
  const { user } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div>
        <Jumbotron title="Home Page" />
        <pre>{ JSON.stringify( auth ) }</pre>

      </div>
    )
  );
};


export default Home;