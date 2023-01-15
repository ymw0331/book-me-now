import Jumbotron from '../components/cards/Jumbotron';
import { useSelector } from 'react-redux';


const NewHotel = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (
    (
      <div>
        <Jumbotron title="Post a new hotel" />
        <pre>{ JSON.stringify( auth ) }</pre>

      </div>
    )
  );
};


export default NewHotel;