import DashboardNav from '../components/DashboardNav';
import ConnectNav from '../components/ConnectNav';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomeOutlined } from '@ant-design/icons';
import { createConnectAccount } from '../actions/stripe';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { sellerHotels } from '../actions/hotel';
import SmallCard from '../components/cards/SmallCard';

const DashboardSeller = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const [ hotels, setHotels ] = useState( [] );
  const [ loading, setLoading ] = useState( false );

  useEffect( () =>
  {
    loadSellersHotels();
  }, [] );

  const loadSellersHotels = async () =>
  {
    let { data } = await sellerHotels( auth.token );
    setHotels( data );
  };


  const handleClick = async () =>
  {
    setLoading( true );
    try
    {
      let res = await createConnectAccount( auth.token );
      console.log( res ); //get login link
      window.location.href = res.data;  //open the url link

    } catch ( error )
    {
      console.log( error );
      toast.error( "Stripe connect failed, Try again." );
      setLoading( false );
    }
  };

  const handleHotelDelete = async ( token, hotelId ) =>
  {
    deleteHotel( auth.token, hotelId ).then( res =>
    {

    } );
  };

  const connected = () =>
  (
    <div className='container-fluid '>
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
      <div className='row'>
        {/* <pre>{ JSON.stringify( hotels, null, 4 ) }</pre> */ }

        { hotels.map( h =>
          <SmallCard
            key={ h._id }
            h={ h }
            showMoreViewButton={ false }
            owner={ true }
            handleHotelDelete={ handleHotelDelete }
          /> ) }

      </div>

    </div>
  );

  const notConnected = () =>
  (
    <div className='container-fluid '>
      <div className='row '>
        <div className='col-md-6 offset-md-3 text-center'>
          <HomeOutlined className="h1" />
          <h4>Setup payout to post hotel rooms</h4>
          <p className="lead">
            WayneHotelPlatform partners with stripe to transfer earnings to your bank accounts
          </p>
          <button
            disabled={ loading }
            onClick={ handleClick }
            className='btn btn-primary mb-3'>
            { loading ? "Processing..." : "Setup Payouts" }
          </button>

          <p className='text-muted'>
            <small>
              You'll be redirected to Stripe to complete the onboarding process.
            </small>
          </p>
        </div>

      </div>
    </div>
  );


  return (
    <>
      <div className='container-fluid jumbotron p-5 jumbotron'>
        <ConnectNav />
      </div>
      <div className='container-fluid p-4'>
        <DashboardNav />
      </div>

      { auth &&
        auth.user &&
        auth.user.stripe_seller &&
        auth.user.stripe_seller.charges_enabled
        ? connected() : notConnected()
      }

      {/* <pre>{ JSON.stringify( auth, null, 4 ) }</pre> */ }

    </>
  );
};

export default DashboardSeller;