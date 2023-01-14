import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';

const Home = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div>
        <Jumbotron title="Home Page" />
        <pre>{ JSON.stringify( auth ,null, ) }</pre>

      </div>
    )
  );
};


export default Home;