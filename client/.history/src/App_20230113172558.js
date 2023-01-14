import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';


import Login from './auth/Login.jsx';
import Register from './auth/Register.jsx';
import Home from "./booking/Home.jsx";
import TopNav from './components/TopNav.jsx';



function App ()
{
  return (
    <BrowserRouter>
      {/* { TopNav() } */ }
      <Toaster position='top-right' />

      <TopNav />
      <Routes>
        <Route>
          <Route exact path="/" element={ <Home /> } />
          <Route exact path="/login" element={ <Login /> } />
          <Route exact path="/register" element={ <Register /> } />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}
export default App;
