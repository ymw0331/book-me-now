import Jumbotron from '../components/cards/Jumbotron';
import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';

const Dashboard = () =>
{
  return (
    <>
      <Jumbotron
        title="Dashboard"
      />
      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      <div className='container'>
        <p>Show all bookings and a button to browser hotels</p>
      </div>
    </>
  );
};

export default Dashboard;