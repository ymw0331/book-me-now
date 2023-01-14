import Jumbotron from '../components/cards/Jumbotron';
import DashboardNav from '../components/DashboardNav';

const DashboardSeller = () =>
{
  return (
    <>
      <Jumbotron
        title="Seller Dashboard "
      />
      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      <div className='container'>
        <p>Show all hotels </p>
      </div>
    </>
  );
};

export default DashboardSeller;