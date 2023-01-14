import Jumbotron from '../components/cards/Jumbotron';
import DashboardNav from '../components/DashboardNav';

const DashboardSeller = () =>
{
  return (
    <>
      <Jumbotron
        title="Seller Dashboard "
      />
      <div className='container-fluid bg-secondary p-5'>
        <ConnectNav />
      </div>
      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      <div className='container'>
        <p>Show all hotels user has posted and add a button to add new</p>
      </div>
    </>
  );
};

export default DashboardSeller;