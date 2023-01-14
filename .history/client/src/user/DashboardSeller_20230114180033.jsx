import Jumbotron from '../components/cards/Jumbotron';
import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';

const DashboardSeller = () =>
{
  return (
    <>
      {/* <Jumbotron
        title="Seller Dashboard "
      /> */}

      <div className='container-fluid bg-secondary p-5'>
        <ConnectNav />
      </div>
      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      <div className='container'>
        <p>Show all hotels user has posted and add a button to add new</p>
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

export default DashboardSeller;