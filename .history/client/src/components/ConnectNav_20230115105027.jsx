import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Avatar, Badge } from 'antd';
import moment from 'moment';
import { getAccountBalance, currencyFormatter, payoutSetting } from '../actions/stripe';
import { SettingOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Ribbon } = Badge;

const ConnectNav = () =>
{
  const { auth } = useSelector( ( state ) => ( { ...state } ) );
  const { user } = auth;
  const [ balance, setBalance ] = useState( 0 );

  useEffect( () =>
  {
    getAccountBalance( auth.token ).then( res =>
    {
      // console.log( res );
      setBalance( res.data );
    } );
  } );

  const handlePayoutSettings = () =>
  {

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
              <Card className='bg-light pointer'
                onClick={ handlePayoutSettings }
              >
<SettingOutlined 
className='h'
              </Card>
            </Ribbon>
          </>
        )
      }
    </div>
  );
};


export default ConnectNav;

