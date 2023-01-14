import { Link } from 'react-router-dom';


const DashboardNav = () =>
{
const active = woindow
  return (
    <ul className='nav nav-tabs'>
      <li className='nav-item'>
        <Link to="/dashboard"
          className={ `nav-link` }>
          Your Bookings
        </Link>
      </li>

      <li className='nav-item'>
        <Link to="/dashboard/seller"
          className={ `nav-link` }>
          Your Hotels
        </Link>
      </li>

    </ul>
  );
};

export default DashboardNav;