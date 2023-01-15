import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Avatar, Badge } from 'antd';
import moment from 'moment';
import { getAccountBalance, currencyFormatter, payoutSetting } from '../actions/stripe';
import { SettingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';


const { Meta } = Card;
const { Ribbon } = Badge;

const ConnectNav = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const { user, token } = auth;
  const [ balance, setBalance ] = useState( 0 );
  const [ loading, setLoading ] = useState( false );

  useEffect( () =>
  {
    getAccountBalance( auth.token ).then( res =>
    {
      // console.log( res );
      setBalance( res.data );
    } );
  } );

  const handlePayoutSettings = async () =>
  {
    setLoading( true );
    try
    {
      const res = await payoutSetting( token );
      console.log( "RES FOR PAYOUT SETTING LINK ==>", res );
      window.location.href = res.data.url;

      setLoading( false );

    } catch ( error )
    {
      console.log( error );
      setLoading( false );
      toast.error( "Unable to access settings. Try again" );
    }
  };


  return (
    <div className='d-flex justify-content-around'>
      <Card>
        <Meta
          avatar={
            <Avatar>
              user.name[ 0 ]
            </Avatar> }
          title={ user.name }
          description={ `Joined ${ moment( user.createdAt ).fromNow() }` }
        />
      </Card>


      { auth && auth.user
        && auth.user.stripe_seller
        && auth.user.stripe_seller.charges_enabled &&
        (
          <>
            <Ribbon text="Available" color="grey">
              <Card className='bg-light pt-2'>
                { balance &&
                  balance.pending &&
                  balance.pending.map( ( bp, i ) => (
                    <span key={ i }>
                      { currencyFormatter( bp ) }
                    </span>
                  ) ) }
              </Card>
            </Ribbon>
            <Ribbon text="Payouts" color="silver">
              <Card className='bg-light pointer pt-2'
                onClick={ handlePayoutSettings }
              >
                <SettingOutlined
                  className='h5' />
              </Card>
            </Ribbon>
          </>
        )
      }
    </div>
  );
};


export default ConnectNav;

