import Jumbotron from '../components/cards/Jumbotron';

const Dashboard = () =>
{

  return (
    <>
      <Jumbotron
        title="Dashboard"

      />

      <div className='container'>
        <p>Show all bookings and a button to browser hotels</p>
      </div>
    </>
  );
};

export default Dashboard;