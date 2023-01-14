import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from './components/TopNav.jsx';
import PrivateRoute from './components/'

//components
import Home from "./booking/Home.jsx";
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Dashboard from './user/Dashboard.jsx';




function App ()
{
  return (
    <BrowserRouter>
      {/* { TopNav() } */ }

      <TopNav />
      <ToastContainer
        position='top-center'
      />
      <Routes>
        <Route>
          <Route exact path='/' element={ <Home /> } />
          <Route exact path='/login' element={ <Login /> } />
          <Route exact path='/register' element={ <Register /> } />
          <Route exact path='/dashboard' element={ <Dashboard /> } />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
