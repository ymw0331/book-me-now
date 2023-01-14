import Jumbotron from '../components/cards/Jumbotron';
import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';

const Dashboard = () =>
{
  return (
    <>
      {/* <Jumbotron
        title="Dashboard"
      /> */}

      <div className='container-fluid bg-secondary p-5'>
        <ConnectNav />
      </div>

      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      <div className='container-fluid'>
        <div className='row'>

          <div className='col-md-1'></div>
        </div>

      </div>
    </>
  );
};

export default Dashboard;