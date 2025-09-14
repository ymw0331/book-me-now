import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { stripeSuccessRequest } from '../actions/stripe';
import Jumbotron from '../components/cards/Jumbotron';
import Spinner from '../components/ui/Spinner';
import { CheckCircle } from 'lucide-react';

const StripeSuccess = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { auth: { token } } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    stripeSuccessRequest(token, hotelId)
      .then(res => {
        if (res.data.success) {
          navigate("/dashboard");
        } else {
          navigate("/stripe/cancel");
        }
      });
  }, [hotelId, token, navigate]);

  return (
    <>
      <Jumbotron title="Payment Processing" />
      <div className='flex justify-center items-center p-12'>
        <div className="text-center">
          <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Processing your booking...</p>
          <Spinner size="large" color="primary" />
        </div>
      </div>
    </>
  );
};

export default StripeSuccess;