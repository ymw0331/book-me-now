import { Link } from 'react-router-dom';


const DashboardNav = () =>
{

  return (
    <ul className='nav nav-tabs'>
      <li className='nav-item'>
        <Link to="/dashboard" 
        className={}>
          Your Bookings
        </Link>
      </li>

      <li className='nav-item'>
        <Link to="/dashboard/seller">
          Your Hotels
        </Link>
      </li>

    </ul>
  );
};

export default DashboardNav;