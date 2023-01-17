import Jumbotron from '../components/cards/Jumbotron';
import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';
import { Link } from 'react-router-dom';
import { userHotelBookings } from "../actions/hotel";
import { useSelector } from "react-redux";

const Dashboard = () =>
{
  const {
    auth: { token },
  } = useSelector( ( state ) => ( { ...state } ) );
  const [ booking, setBooking ] = useState( [] );

  return (
    <>
      {/* <Jumbotron
        title="Dashboard"
      /> */}

      <div className='container-fluid jumbotron p-5'>
        <ConnectNav />
      </div>

      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      <div className='container-fluid'>
        <div className='row'>

          <div className='col-md-10'>
            <h2>Your Bookings</h2>
          </div>

          <div className='col-md-2'>
            <Link
              to="/"
              className='btn btn-primary '>
              Browse Hotels
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;