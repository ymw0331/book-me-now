import { useParams } from 'react-router-dom';
import Jumbotron from '../components/cards/Jumbotron';


const StripeCancel = () =>
{

  const { hotelId } = useParams();

  return (
    <>
      <Jumbotron
        title={ `Payment Success ${ hoteId }` }
 
    </>
  );
};

export default StripeCancel;
