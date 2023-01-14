import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';

const Home = () =>
{
  const { user } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div>
        <Jumbotron title=""/>

      </div>
    )
  );
};


export default Home;