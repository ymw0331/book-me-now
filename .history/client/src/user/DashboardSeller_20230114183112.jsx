import Jumbotron from '../components/cards/Jumbotron';
import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';
import { Link } from 'react-router-dom';

const DashboardSeller = () =>
{

  const connected  = () =>{

  }

  const notConnect = () 

  return (
    <>
      {/* <Jumbotron
        title="Seller Dashboard "
      /> */}

      <div className='container-fluid bg-secondary p-5'>
        <ConnectNav />
      </div>
      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      <div className='container-fluid'>
        <div className='row'>

          <div className='col-md-10'>
            <h2>Your Hotels</h2>
          </div>

          <div className='col-md-2'>
            <Link
              to="/hotels/new"
              className='btn btn-primary '>
              + Add New
            </Link>
          </div>

        </div>
      </div>


    </>
  );
};

export default DashboardSeller;