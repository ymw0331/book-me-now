import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';
import { Link } from 'react-router-dom';
import { userHotelBookings } from "../actions/hotel";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import BookingCard from "../components/cards/BookingCard";
import { Button } from '../components/ui/Button';

const Dashboard = () => {
  const {
    auth: { token },
  } = useSelector((state) => ({ ...state }));
  const [booking, setBooking] = useState([]);

  useEffect(() => {
    loadUserBookings();
  }, []);

  const loadUserBookings = async () => {
    const res = await userHotelBookings(token);
    console.log(res);
    setBooking(res.data);
  };

  return (
    <>
      <div className='w-full jumbotron p-8'>
        <ConnectNav />
      </div>

      <div className='w-full px-4 py-4'>
        <DashboardNav />
      </div>

      <div className='w-full px-4'>
        <div className='flex flex-wrap items-center justify-between mb-6'>
          <div className='flex-1'>
            <h2 className='text-2xl font-bold text-gray-900'>Your Bookings</h2>
          </div>
          <div>
            <Link to="/">
              <Button variant="primary">
                Browse Hotels
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {booking.map((b) => (
            <BookingCard
              key={b._id}
              hotel={b.hotel}
              session={b.session}
              orderedBy={b.orderedBy}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;