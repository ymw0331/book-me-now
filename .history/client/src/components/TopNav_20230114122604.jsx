import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function TopNav ()
{
  


  return (
    <div>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2 sticky-top bg-light">
        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/">HOME</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/login">LOGIN</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/register">REGISTER</NavLink>
        </li>
      </ul>
    </div>
  );

}