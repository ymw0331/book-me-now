import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


const TopNav = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );

  return (
    <div>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2 sticky-top bg-light">
        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/">
            HOME
          </NavLink>
        </li>

      
      </ul>
    </div>
  );
};


export default TopNav;