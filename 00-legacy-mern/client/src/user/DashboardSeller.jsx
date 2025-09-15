import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home } from 'lucide-react';
import { createConnectAccount } from '../actions/stripe';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { sellerHotels, deleteHotel } from '../actions/hotel';
import SmallCard from '../components/cards/SmallCard';
import { Button } from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const DashboardSeller = () => {
  const { auth } = useSelector((state) => ({ ...state }));
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSellersHotels();
  }, []);

  const loadSellersHotels = async () => {
    let { data } = await sellerHotels(auth.token);
    setHotels(data);
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      let res = await createConnectAccount(auth.token);
      console.log(res);
      window.location.href = res.data;
    } catch (error) {
      console.log(error);
      toast.error("Stripe connect failed, Try again.");
      setLoading(false);
    }
  };

  const handleHotelDelete = async (hotelId) => {
    if (!window.confirm("Are you sure?")) return;
    deleteHotel(auth.token, hotelId).then((res) => {
      toast.success("Hotel Deleted");
      loadSellersHotels();
    });
  };

  const connected = () => (
    <div className='w-full px-4'>
      <div className='flex flex-wrap items-center justify-between mb-6'>
        <div className='flex-1'>
          <h2 className='text-2xl font-bold text-gray-900'>Your Hotels</h2>
        </div>
        <div>
          <Link to="/hotels/new">
            <Button variant="primary">
              + Add New
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {hotels.map(h => (
          <SmallCard
            key={h._id}
            h={h}
            showViewMoreButton={false}
            owner={true}
            handleHotelDelete={handleHotelDelete}
          />
        ))}
      </div>
    </div>
  );

  const notConnected = () => (
    <div className='w-full px-4'>
      <div className='flex flex-col items-center justify-center py-12'>
        <Home className='w-16 h-16 text-gray-400 mb-4' />
        <h2 className='text-2xl font-bold text-gray-900 mb-2'>
          Setup payouts to post hotel rooms
        </h2>
        <p className='text-gray-600 mb-6 text-center max-w-md'>
          MERN partners with stripe to transfer earnings to your bank account
        </p>
        <Button
          onClick={handleClick}
          variant="primary"
          size="large"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner size="small" color="white" className="mr-2" />
              Processing...
            </>
          ) : (
            'Setup Payouts'
          )}
        </Button>
        <p className='text-sm text-gray-500 mt-4'>
          You'll be redirected to Stripe to complete the onboarding process.
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className='w-full jumbotron p-8'>
        <ConnectNav />
      </div>

      <div className='w-full px-4 py-4'>
        <DashboardNav />
      </div>

      {auth &&
        auth.user &&
        auth.user.stripe_seller &&
        auth.user.stripe_seller.charges_enabled
        ? connected()
        : notConnected()}
    </>
  );
};

export default DashboardSeller;