import { Link } from 'react-router-dom';


const DashboardNav = () =>
{
  const active = window.location.pathname;
  // console.log( "location => ", active );

  return (
    <ul className='nav nav-tabs'>
      <li className='nav-item'>
        <Link to="/dashboard"
          className={ `nav-link ${active === }` }>
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