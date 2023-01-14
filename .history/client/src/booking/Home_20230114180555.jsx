import Jumbotron from '../components/cards/Jumbotron';

const Home = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div>
        <Jumbotron title="Home Page" />

      </div>
    )
  );
};


export default Home;