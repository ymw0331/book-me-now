import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Home from "./booking/Home.jsx";
import TopNav from './components/TopNav.jsx';

// const TopNav = () =>
// {
//   <div className='nav bg-light d-flex justify-content-between'>
//     <Link className='nav-link' to="/"> Home</Link>
//     <Link className='nav-link' to="/login"> Login</Link>
//     <Link className='nav-link' to="/register"> Register</Link>
//   </div>;
// };


function App ()
{
  return (
    <BrowserRouter>
      {/* { TopNav() } */ }
      <TopNav />
      <Routes>
        <Route>
          <Route exact path="/" element={ <Home /> } />
          <Route exact path="/login" element={ <Login /> } />
          <Route exact path="/register" element={ <Register /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
