import { NavLink } from 'react-router-dom';

export default function TopNav ()
{
  //   <div className='nav bg-light d-flex justify-content-between'>
  //   <Link className='nav-link' to="/"> Home</Link>
  //   <Link className='nav-link' to="/login"> Login</Link>
  //   <Link className='nav-link' to="/register"> Register</Link>
  // </div>;
  return (
    <div>
      <ul className="nav d-flex justify-content-between shadow-sm mb-2 sticky-top bg-light">
        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/">HOME</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/shop">LOGIN</NavLink>
        </li>

        <li className="nav-item">
          <NavLink className="nav-link " aria-current="page" to="/shop">REG</NavLink>
        </li>
      </ul>
    </div>
  );

}