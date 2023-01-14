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

        { auth !== null && (
          <>
            <a className="nav-item">
              <NavLink className="nav-link " aria-current="page" to="/logout">
                LOGOUT
              </NavLink>
            </a>
          </>
        ) }


        {
          //if user is not sign in
          auth === null && <>
            <li className="nav-item">
              <NavLink className="nav-link " aria-current="page" to="/login">
                LOGIN
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link " aria-current="page" to="/register">
                REGISTER
              </NavLink>
            </li>
          </>
        }

      </ul>
    </div>
  );
};


export default TopNav;