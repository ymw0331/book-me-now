import { useParams } from 'react-router-dom';
import Jumbotron from '../components/cards/Jumbotron';


const StripeCancel = () =>
{
  return (
    <>
      <Jumbotron
        title="Payment Successful"
      />
    </>
  );
};

export default StripeCancel;