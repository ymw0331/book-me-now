import Jumbotron from '../components/cards/Jumbotron';

const Dashboard = () =>
{

  return (
    <>

      <Jumbotron />
      <div className='container-fluid bg-secondary p-5'>
        <h1>Dashboard</h1>
      </div>

      <div className='container'>
        <p>Show all bookings and a button to browser hotels</p>
      </div>
    </>
  );
};

export default Dashboard;