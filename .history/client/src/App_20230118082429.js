import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopNav from './components/TopNav.jsx';
import PrivateRoute from './components/PrivateRoute';

//components
import Home from "./booking/Home.jsx";
import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Dashboard from './user/Dashboard.jsx';
import DashboardSeller from './user/DashboardSeller.jsx';
import NewHotel from './hotels/NewHotel.jsx';
import EditHotel from './hotels/EditHotel.jsx';
import StripeCallback from './stripe/StripeCallback.js';
import ViewHotel from './hotels/ViewHotel.jsx';
import StripeSuccess from './stripe/StripeSuccess';
import StripeCancel from './stripe/StripeCancel';
import SearchResult from "./hotels/SearchResult";


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

          <Route path='/dashboard' element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path='/dashboard/seller' element={
            <PrivateRoute>
              <DashboardSeller />
            </PrivateRoute>
          } />

          <Route path='/hotels/new' element={
            <PrivateRoute>
              <NewHotel />
            </PrivateRoute>
          } />

          <Route path='/hotel/edit/:hotelId' element={
            <PrivateRoute>
              <EditHotel />
            </PrivateRoute>
          } />

          <Route path='/hotel/:hotelId' element={
            <ViewHotel />
          } />


          <Route path='/stripe/callback' element={
            <PrivateRoute>
              <StripeCallback />
            </PrivateRoute>
          } />


          <Route path='/stripe/success/:hotelId' element={
            <PrivateRoute>
              <StripeSuccess />
            </PrivateRoute>
          } />

          <Route path='/stripe/cancel' element={
            <PrivateRoute>
              <StripeCancel />
            </PrivateRoute>
          } />
          
          <Route path='/stripe/cancel' element={
            <PrivateRoute>
              <StripeCancel />
            </PrivateRoute>
          } />



        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
