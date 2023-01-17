import Jumbotron from '../components/cards/Jumbotron';

const StripeCancel = () =>
{
  return (
    <div className="container">

      <Jumbotron />

      <div className="col">
        <h2 className="text-center p-5">Payment success.</h2>
      </div>
    </div>
  );
};

export default StripeCancel;
