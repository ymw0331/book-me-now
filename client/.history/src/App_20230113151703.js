import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Home from "./booking/Home.jsx";

const TopNav = () =>
{
  <div className='nav bg-light d-flex justify-content-between'>
    <Link className='nav-link'>
Home
    </Link>
  </div>;
};


function App ()
{
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ Home } />
        <Route exact path="/login" component={ Login } />
        <Route exact path="/register" component={ Register } />
      </Switch>
    </BrowserRouter>
  );
}
export default App;
