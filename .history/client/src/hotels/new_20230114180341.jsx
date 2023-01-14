import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';

const Home = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div>
        <Jumbotron title="Home Page" />
      </div>
      <pre>{JSON.stringify(null,)}</pre>
    )
  );
};


export default Home;